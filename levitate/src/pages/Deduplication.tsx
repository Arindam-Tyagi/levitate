// levitate/src/pages/Deduplication.tsx
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useDatasets } from '../hooks/useDatasets';
import { API_ENDPOINTS } from '../config/api';

export const Deduplication: React.FC = () => {
  const { activeDataset, updateDataset } = useDatasets();
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [duplicates, setDuplicates] = useState<any[][]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleColumnToggle = (column: string) => {
    setSelectedColumns(prev =>
      prev.includes(column) ? prev.filter(c => c !== column) : [...prev, column]
    );
  };

  const findDuplicates = async () => {
    if (!activeDataset || selectedColumns.length === 0) return;

    setIsProcessing(true);
    try {
      const response = await fetch(API_ENDPOINTS.DEDUPLICATION_FIND, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          datasetId: activeDataset._id,
          columns: selectedColumns,
        }),
      });
      const data = await response.json();
      setDuplicates(data);
    } catch (error) {
      console.error('Error finding duplicates:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const mergeDuplicates = async (group: any[]) => {
    if (!activeDataset) return;
    try {
      const response = await fetch(API_ENDPOINTS.DEDUPLICATION_MERGE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          datasetId: activeDataset._id,
          records: group,
        }),
      });
      const updatedDataset = await response.json();
      updateDataset(activeDataset._id, updatedDataset);
      setDuplicates(prev => prev.filter(g => g !== group));
    } catch (error) {
      console.error('Error merging duplicates:', error);
    }
  };

  if (!activeDataset) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deduplication</h1>
          <p className="text-gray-600 mt-2">No active dataset selected.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Deduplication / Entity Resolution</h1>
        <p className="text-gray-600 mt-2">
          Find and merge duplicate records in: {activeDataset.name}
        </p>
      </div>

      <Card title="Configuration">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">Select columns to match on:</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {activeDataset.columns.map(col => (
                <Button
                  key={col}
                  variant={selectedColumns.includes(col) ? 'primary' : 'secondary'}
                  onClick={() => handleColumnToggle(col)}
                >
                  {col}
                </Button>
              ))}
            </div>
          </div>
          <Button onClick={findDuplicates} disabled={isProcessing || selectedColumns.length === 0}>
            {isProcessing ? 'Finding Duplicates...' : 'Find Duplicates'}
          </Button>
        </div>
      </Card>

      {duplicates.length > 0 && (
        <Card title="Duplicate Sets">
          <div className="space-y-4">
            {duplicates.map((group, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Duplicate Set {index + 1}</h3>
                <div className="space-y-2">
                  {group.map((record, rIndex) => (
                    <pre key={rIndex} className="bg-gray-100 p-2 rounded text-xs">
                      {JSON.stringify(record, null, 2)}
                    </pre>
                  ))}
                </div>
                <Button onClick={() => mergeDuplicates(group)} variant="primary" className="mt-2">
                  Merge
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};