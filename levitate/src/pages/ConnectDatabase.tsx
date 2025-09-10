// levitate/src/pages/ConnectDatabase.tsx

import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useDatasets } from '../hooks/useDatasets';
import { Dataset } from '../types';
import { Database, Zap } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

export const ConnectDatabase: React.FC = () => {
  const { addDataset } = useDatasets();
  const [credentials, setCredentials] = useState({
    dbType: 'mysql',
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: '',
    table: '',
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    setError(null);

    try {
      const response = await fetch(API_ENDPOINTS.DB_CONNECT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to connect to the database.');
      }

      const result = await response.json();
      const newDataset: Dataset = result.dataset;
      addDataset(newDataset);
      // You can add a success message or navigation here
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Connect to Database</h1>
        <p className="text-gray-600 mt-2">
          Directly connect to your database to import data.
        </p>
      </div>

      <Card title="Database Credentials" subtitle="Enter your database connection details below">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Database Type</label>
            <select name="dbType" value={credentials.dbType} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="mysql">MySQL</option>
              <option value="postgresql">PostgreSQL</option>
              <option value="mongodb">MongoDB</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Host</label>
            <input type="text" name="host" value={credentials.host} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Port</label>
            <input type="text" name="port" value={credentials.port} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">User</label>
            <input type="text" name="user" value={credentials.user} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"/>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" value={credentials.password} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"/>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Database Name</label>
            <input type="text" name="database" value={credentials.database} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Table / Collection Name</label>
            <input type="text" name="table" value={credentials.table} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"/>
          </div>


          {error && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded-md text-sm">
              {error}
            </div>
          )}

          <Button type="submit" variant="primary" className="w-full" disabled={isConnecting}>
            <Zap className="h-4 w-4 mr-2" />
            {isConnecting ? 'Connecting...' : 'Connect and Fetch Data'}
          </Button>
        </form>
      </Card>
    </div>
  );
};