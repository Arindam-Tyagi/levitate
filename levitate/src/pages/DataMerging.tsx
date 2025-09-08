import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useDatasets } from '../hooks/useDatasets';
import { Dataset, MergeConfig } from '../types';
import { Merge, ArrowRight, Database } from 'lucide-react';

export const DataMerging: React.FC = () => {
  const { datasets, addDataset } = useDatasets();
  const [mergeConfig, setMergeConfig] = useState<MergeConfig>({
    leftDataset: '',
    rightDataset: '',
    joinKey: '',
    joinType: 'inner'
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const leftDataset = datasets.find(d => d._id === mergeConfig.leftDataset);
  const rightDataset = datasets.find(d => d._id === mergeConfig.rightDataset);

  const commonColumns = leftDataset && rightDataset 
    ? leftDataset.columns.filter(col => rightDataset.columns.includes(col))
    : [];

  const handleMerge = async () => {
    if (!leftDataset || !rightDataset || !mergeConfig.joinKey) return;

    setIsProcessing(true);
    
    // Note: This is a frontend simulation. A real implementation would send this request to the backend.
    setTimeout(() => {
      const mergedData: any[] = [];
      
      leftDataset.dataPreview.forEach(leftRow => {
        const matchingRightRows = rightDataset.dataPreview.filter(
          rightRow => rightRow[mergeConfig.joinKey] === leftRow[mergeConfig.joinKey]
        );

        if (matchingRightRows.length > 0) {
          matchingRightRows.forEach(rightRow => {
            mergedData.push({ ...leftRow, ...rightRow });
          });
        } else if (mergeConfig.joinType === 'left' || mergeConfig.joinType === 'outer') {
          mergedData.push(leftRow);
        }
      });

      if (mergeConfig.joinType === 'right' || mergeConfig.joinType === 'outer') {
        rightDataset.dataPreview.forEach(rightRow => {
          const hasMatch = leftDataset.dataPreview.some(
            leftRow => leftRow[mergeConfig.joinKey] === rightRow[mergeConfig.joinKey]
          );
          if (!hasMatch) {
            mergedData.push(rightRow);
          }
        });
      }

      const newMergedDataset: Dataset = {
        _id: Date.now().toString(),
        name: `${leftDataset.name} + ${rightDataset.name}`,
        columns: [...new Set([...leftDataset.columns, ...rightDataset.columns])],
        dataPreview: mergedData,
        createdAt: new Date().toISOString(),
        size: leftDataset.size + rightDataset.size,
        rowCount: mergedData.length,
        sourceType: 'upload', // Or a new 'merged' type
      };

      addDataset(newMergedDataset);
      setIsProcessing(false);
      
      setMergeConfig({ leftDataset: '', rightDataset: '', joinKey: '', joinType: 'inner' });
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Data Merging</h1>
        <p className="text-gray-600 mt-2">Combine multiple datasets based on common columns</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Merge Configuration" subtitle="Select datasets and join parameters">
          <div className="space-y-6">
            {/* Left Dataset Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Left Dataset</label>
              <select value={mergeConfig.leftDataset} onChange={(e) => setMergeConfig(prev => ({ ...prev, leftDataset: e.target.value, joinKey: '' }))} className="w-full border border-gray-200 rounded-lg px-3 py-2">
                <option value="">Select dataset...</option>
                {datasets.map(dataset => (
                  <option key={dataset._id} value={dataset._id}>{dataset.name} ({dataset.rowCount} rows)</option>
                ))}
              </select>
            </div>

            {/* Right Dataset Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Right Dataset</label>
              <select value={mergeConfig.rightDataset} onChange={(e) => setMergeConfig(prev => ({ ...prev, rightDataset: e.target.value, joinKey: '' }))} className="w-full border border-gray-200 rounded-lg px-3 py-2">
                <option value="">Select dataset...</option>
                {datasets.filter(d => d._id !== mergeConfig.leftDataset).map(dataset => (
                  <option key={dataset._id} value={dataset._id}>{dataset.name} ({dataset.rowCount} rows)</option>
                ))}
              </select>
            </div>

            {/* Join Key */}
            {commonColumns.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Join Column</label>
                <select value={mergeConfig.joinKey} onChange={(e) => setMergeConfig(prev => ({ ...prev, joinKey: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2">
                  <option value="">Select join column...</option>
                  {commonColumns.map(column => (<option key={column} value={column}>{column}</option>))}
                </select>
              </div>
            )}

            {/* Join Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Join Type</label>
              <select value={mergeConfig.joinType} onChange={(e) => setMergeConfig(prev => ({ ...prev, joinType: e.target.value as 'inner' | 'left' | 'right' | 'outer' }))} className="w-full border border-gray-200 rounded-lg px-3 py-2">
                <option value="inner">Inner Join</option>
                <option value="left">Left Join</option>
                <option value="right">Right Join</option>
                <option value="outer">Outer Join</option>
              </select>
            </div>

            {/* Merge Button */}
            <Button onClick={handleMerge} disabled={!leftDataset || !rightDataset || !mergeConfig.joinKey || isProcessing} variant="primary" className="w-full">
              {isProcessing ? <><Database className="h-4 w-4 mr-2 animate-pulse" /> Processing Merge...</> : <><Merge className="h-4 w-4 mr-2" /> Merge Datasets</>}
            </Button>
          </div>
        </Card>
        {/* ... Merge Preview Card ... */}
      </div>
    </div>
  );
};