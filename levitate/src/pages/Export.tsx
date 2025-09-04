import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useDatasets } from '../hooks/useDatasets';
import { exportToCSV, downloadFile } from '../utils/dataProcessing';
import { Download, FileSpreadsheet, Database, CheckCircle } from 'lucide-react';

export const Export: React.FC = () => {
  const { datasets, activeDataset } = useDatasets();
  const [selectedDataset, setSelectedDataset] = useState(activeDataset?.id || '');
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel'>('csv');
  const [isExporting, setIsExporting] = useState(false);

  const datasetToExport = datasets.find(d => d.id === selectedDataset);

  const handleExport = async () => {
    if (!datasetToExport) return;

    setIsExporting(true);

    // Simulate export processing
    setTimeout(() => {
      if (exportFormat === 'csv') {
        const csvContent = exportToCSV(datasetToExport);
        downloadFile(csvContent, `${datasetToExport.name}.csv`, 'text/csv');
      } else {
        // For Excel export, we'd typically use a library like xlsx
        // For now, just download as CSV with different extension
        const csvContent = exportToCSV(datasetToExport);
        downloadFile(csvContent, `${datasetToExport.name}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      }

      setIsExporting(false);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Export Data</h1>
        <p className="text-gray-600 mt-2">
          Download your processed datasets in various formats
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Export Configuration */}
        <Card title="Export Configuration" subtitle="Choose dataset and format">
          <div className="space-y-6">
            {/* Dataset Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Dataset
              </label>
              <select
                value={selectedDataset}
                onChange={(e) => setSelectedDataset(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a dataset...</option>
                {datasets.map(dataset => (
                  <option key={dataset.id} value={dataset.id}>
                    {dataset.name} ({dataset.data.length} rows)
                  </option>
                ))}
              </select>
            </div>

            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Export Format
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setExportFormat('csv')}
                  className={`p-4 border rounded-lg text-center transition-all ${
                    exportFormat === 'csv'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FileSpreadsheet className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
                  <p className="font-medium">CSV</p>
                  <p className="text-sm text-gray-600">Comma separated values</p>
                </button>

                <button
                  onClick={() => setExportFormat('excel')}
                  className={`p-4 border rounded-lg text-center transition-all ${
                    exportFormat === 'excel'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Database className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="font-medium">Excel</p>
                  <p className="text-sm text-gray-600">Microsoft Excel format</p>
                </button>
              </div>
            </div>

            {/* Export Button */}
            <Button
              onClick={handleExport}
              disabled={!selectedDataset || isExporting}
              variant="primary"
              className="w-full"
            >
              {isExporting ? (
                <div className="flex items-center">
                  <Download className="h-4 w-4 mr-2 animate-bounce" />
                  Exporting...
                </div>
              ) : (
                <div className="flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Export Dataset
                </div>
              )}
            </Button>
          </div>
        </Card>

        {/* Export Preview */}
        <Card title="Export Preview" subtitle="Preview of the selected dataset">
          {datasetToExport ? (
            <div className="space-y-4">
              {/* Dataset Info */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">{datasetToExport.name}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Rows:</span>
                    <span className="ml-2 font-medium">{datasetToExport.data.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Columns:</span>
                    <span className="ml-2 font-medium">{datasetToExport.columns.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Size:</span>
                    <span className="ml-2 font-medium">{Math.round(datasetToExport.size / 1024)} KB</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Format:</span>
                    <span className="ml-2 font-medium uppercase">{exportFormat}</span>
                  </div>
                </div>
              </div>

              {/* Column Preview */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Columns to Export</h4>
                <div className="space-y-2">
                  {datasetToExport.columns.map((column, index) => (
                    <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                      <CheckCircle className="h-4 w-4 text-emerald-600 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{column}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Data */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Sample Data (First 3 Rows)</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs">
                    <thead className="bg-gray-100">
                      <tr>
                        {datasetToExport.columns.map(column => (
                          <th key={column} className="px-2 py-1 text-left font-medium text-gray-700">
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {datasetToExport.data.slice(0, 3).map((row, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          {datasetToExport.columns.map(column => (
                            <td key={column} className="px-2 py-1 text-gray-900">
                              {row[column]?.toString() || 'null'}
                            </td>
                          ))}
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

      {/* Export History */}
      <Card title="Recent Exports" subtitle="Track your exported files">
        <div className="space-y-3">
          {/* Mock export history */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <FileSpreadsheet className="h-5 w-5 text-emerald-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Sales Data Q1 2024.csv</p>
                <p className="text-sm text-gray-600">Exported 2 hours ago</p>
              </div>
            </div>
            <Button variant="secondary" size="sm">
              Download Again
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Database className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Customer Demographics.xlsx</p>
                <p className="text-sm text-gray-600">Exported yesterday</p>
              </div>
            </div>
            <Button variant="secondary" size="sm">
              Download Again
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};