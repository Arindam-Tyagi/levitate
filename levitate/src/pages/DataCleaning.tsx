import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { DataTable } from '../components/common/DataTable';
import { useDatasets } from '../hooks/useDatasets';
import { removeDuplicates, handleMissingValues, getColumnInfo } from '../utils/dataProcessing';
import { Trash2, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

export const DataCleaning: React.FC = () => {
  const { activeDataset, updateDataset } = useDatasets();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const columnInfo = activeDataset ? getColumnInfo(activeDataset) : [];

  const handleRemoveDuplicates = async () => {
    if (!activeDataset) return;
    
    setIsProcessing(true);
    setTimeout(() => {
      const cleanedDataset = removeDuplicates(activeDataset);
      updateDataset(activeDataset.id, cleanedDataset);
      setIsProcessing(false);
    }, 1000);
  };

  const handleMissingValuesAction = async (action: 'remove' | 'fill') => {
    if (!activeDataset) return;
    
    setIsProcessing(true);
    setTimeout(() => {
      const cleanedDataset = handleMissingValues(activeDataset, action, 'N/A');
      updateDataset(activeDataset.id, cleanedDataset);
      setIsProcessing(false);
    }, 1000);
  };

  if (!activeDataset) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Cleaning</h1>
          <p className="text-gray-600 mt-2">
            No dataset selected. Please upload a dataset first.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Data Cleaning</h1>
        <p className="text-gray-600 mt-2">
          Clean and prepare your data: {activeDataset.name}
        </p>
      </div>

      {/* Data Quality Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Column Analysis">
          <div className="space-y-3">
            {columnInfo.map((col) => (
              <div key={col.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{col.name}</p>
                  <p className="text-sm text-gray-600">{col.type}</p>
                </div>
                <div className="text-right">
                  {col.nullCount > 0 ? (
                    <div className="flex items-center text-amber-600">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      <span className="text-sm">{col.nullCount} nulls</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-emerald-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm">Clean</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Data Actions">
          <div className="space-y-4">
            <Button
              onClick={handleRemoveDuplicates}
              disabled={isProcessing}
              variant="primary"
              className="w-full"
            >
              {isProcessing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Remove Duplicates
            </Button>

            <Button
              onClick={() => handleMissingValuesAction('fill')}
              disabled={isProcessing}
              variant="secondary"
              className="w-full"
            >
              Fill Missing Values
            </Button>

            <Button
              onClick={() => handleMissingValuesAction('remove')}
              disabled={isProcessing}
              variant="danger"
              className="w-full"
            >
              Remove Rows with Nulls
            </Button>
          </div>
        </Card>

        <Card title="Data Summary">
          <div className="space-y-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{activeDataset.data.length}</p>
              <p className="text-sm text-gray-600">Total Rows</p>
            </div>
            
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <p className="text-2xl font-bold text-emerald-600">{activeDataset.columns.length}</p>
              <p className="text-sm text-gray-600">Columns</p>
            </div>

            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <p className="text-2xl font-bold text-amber-600">
                {columnInfo.reduce((sum, col) => sum + col.nullCount, 0)}
              </p>
              <p className="text-sm text-gray-600">Missing Values</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Data Preview */}
      <Card title="Data Preview" subtitle="Preview your dataset">
        <DataTable dataset={activeDataset} />
      </Card>
    </div>
  );
};