import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useDatasets } from '../hooks/useDatasets';
import { exportToCSV, downloadFile } from '../utils/dataProcessing';
import { Download, FileSpreadsheet, Database, CheckCircle } from 'lucide-react';

export const Export: React.FC = () => {
  const { datasets, activeDataset } = useDatasets();
  const [selectedDatasetId, setSelectedDatasetId] = useState(activeDataset?._id || '');
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel'>('csv');
  const [isExporting, setIsExporting] = useState(false);

  // This ensures the dropdown updates if the activeDataset changes from another page
  useEffect(() => {
    if (activeDataset) {
      setSelectedDatasetId(activeDataset._id);
    }
  }, [activeDataset]);

  const datasetToExport = datasets.find(d => d._id === selectedDatasetId);

  const handleExport = async () => {
    if (!datasetToExport) return;

    setIsExporting(true);
    // Note: This is a frontend simulation. A real implementation would fetch the full dataset from the backend before exporting.
    setTimeout(() => {
      const csvContent = exportToCSV(datasetToExport);
      const fileExtension = exportFormat === 'csv' ? 'csv' : 'xlsx';
      const mimeType = exportFormat === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      
      downloadFile(csvContent, `${datasetToExport.name}.${fileExtension}`, mimeType);

      setIsExporting(false);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Export Data</h1>
        <p className="text-gray-600 mt-2">Download your processed datasets in various formats</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Export Configuration */}
        <Card title="Export Configuration" subtitle="Choose dataset and format">
          <div className="space-y-6">
            {/* Dataset Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Dataset</label>
              <select value={selectedDatasetId} onChange={(e) => setSelectedDatasetId(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2">
                <option value="">Choose a dataset...</option>
                {datasets.map(dataset => (
                  <option key={dataset._id} value={dataset._id}>{dataset.name} ({dataset.rowCount} rows)</option>
                ))}
              </select>
            </div>

            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
              <div className="grid grid-cols-2 gap-4">
                {/* CSV and Excel buttons */}
              </div>
            </div>

            {/* Export Button */}
            <Button onClick={handleExport} disabled={!selectedDatasetId || isExporting} variant="primary" className="w-full">
              {isExporting ? <><Download className="h-4 w-4 mr-2 animate-bounce" /> Exporting...</> : <><Download className="h-4 w-4 mr-2" /> Export Dataset</>}
            </Button>
          </div>
        </Card>

        {/* Export Preview */}
        <Card title="Export Preview" subtitle="Preview of the selected dataset">
          {datasetToExport ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">{datasetToExport.name}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-600">Rows:</span><span className="ml-2 font-medium">{datasetToExport.rowCount}</span></div>
                  <div><span className="text-gray-600">Columns:</span><span className="ml-2 font-medium">{datasetToExport.columns.length}</span></div>
                  <div><span className="text-gray-600">Size:</span><span className="ml-2 font-medium">{Math.round(datasetToExport.size / 1024)} KB</span></div>
                  <div><span className="text-gray-600">Format:</span><span className="ml-2 font-medium uppercase">{exportFormat}</span></div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Sample Data (First 3 Rows)</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs">
                    <thead className="bg-gray-100">
                      <tr>{datasetToExport.columns.map(c => <th key={c} className="px-2 py-1 text-left">{c}</th>)}</tr>
                    </thead>
                    <tbody>
                      {datasetToExport.dataPreview.slice(0, 3).map((row, index) => (
                        <tr key={index} className="border-b">
                          {datasetToExport.columns.map(c => <td key={c} className="px-2 py-1">{row[c]?.toString() || 'null'}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Download className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p>Select a dataset to preview the export.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};