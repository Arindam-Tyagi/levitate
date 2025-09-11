import React from 'react';
import { Card } from '../components/ui/Card';
import { FileUpload } from '../components/common/FileUpload';
import { useDatasets } from '../hooks/useDatasets';
import { Dataset } from '../types';
import { API_ENDPOINTS } from '../config/api'; // 1. Import API_ENDPOINTS

//const API_URL = 'http://localhost:5001/api';

export const Upload: React.FC = () => {
  const { datasets, addDataset } = useDatasets();

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(API_ENDPOINTS.UPLOAD, {
        method: 'POST',
        body: formData,
        credentials: 'include', // <-- ADD THIS LINE
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'File upload failed');
      }

      const result = await response.json();
      const newDataset: Dataset = result.dataset;
      
      addDataset(newDataset);

    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload Data</h1>
        <p className="text-gray-600 mt-2">
          Upload your CSV or Excel files to start analyzing your data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Upload Files" subtitle="Drag & drop or click to select files">
          <FileUpload onFileUpload={handleFileUpload} />
        </Card>

        <Card title="Uploaded Datasets" subtitle={`${datasets.length} datasets available`}>
          <div className="space-y-3">
            {datasets.map((dataset) => (
              <div
                key={dataset._id} // Changed to _id
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <h3 className="font-medium text-gray-900">{dataset.name}</h3>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Rows: {dataset.rowCount}</p> 
                  <p>Columns: {dataset.columns.length}</p>
                  <p>Size: {Math.round(dataset.size / 1024)} KB</p>
                  <p>Uploaded: {new Date(dataset.createdAt).toLocaleDateString()}</p> 
                </div>
              </div>
            ))}
            
            {datasets.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No datasets uploaded yet. Upload your first file to get started.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};  