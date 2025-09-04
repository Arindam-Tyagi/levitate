import React, { useState } from 'react';
import { API_ENDPOINTS } from '../../config/api';

export const ApiTest: React.FC = () => {
  const [status, setStatus] = useState<string>('Ready to test');
  const [datasets, setDatasets] = useState<any[]>([]);

  const testBackendConnection = async () => {
    setStatus('Testing backend connection...');
    try {
      const response = await fetch(API_ENDPOINTS.DATASETS);
      if (response.ok) {
        const data = await response.json();
        setDatasets(data);
        setStatus(`✅ Backend connected! Found ${data.length} datasets`);
      } else {
        setStatus(`❌ Backend error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setStatus(`❌ Connection failed: ${error}`);
    }
  };

  const testUploadEndpoint = async () => {
    setStatus('Testing upload endpoint...');
    try {
      const response = await fetch(API_ENDPOINTS.UPLOAD, {
        method: 'GET', // Just testing if endpoint exists
      });
      if (response.ok) {
        setStatus('✅ Upload endpoint accessible');
      } else {
        setStatus(`❌ Upload endpoint error: ${response.status}`);
      }
    } catch (error) {
      setStatus(`❌ Upload test failed: ${error}`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Backend Integration Test</h3>
      
      <div className="space-y-4">
        <div className="flex space-x-3">
          <button
            onClick={testBackendConnection}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Test Datasets API
          </button>
          
          <button
            onClick={testUploadEndpoint}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Test Upload API
          </button>
        </div>

        <div className="p-3 bg-gray-100 rounded">
          <p className="text-sm font-medium">Status:</p>
          <p className="text-sm">{status}</p>
        </div>

        {datasets.length > 0 && (
          <div className="p-3 bg-blue-50 rounded">
            <p className="text-sm font-medium text-blue-800">Datasets from Backend:</p>
            <ul className="text-sm text-blue-700 mt-2">
              {datasets.map((dataset, index) => (
                <li key={index}>• {dataset.name || `Dataset ${index + 1}`}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}; 