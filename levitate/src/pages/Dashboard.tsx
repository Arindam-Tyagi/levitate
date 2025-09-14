import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card } from '../components/ui/Card';
import { useDatasets } from '../hooks/useDatasets';
import { analyzeDataset } from '../utils/dataProcessing';
import { generateDynamicChartData } from '../utils/chartUtils';
import { Database, FileText, AlertCircle, TrendingUp } from 'lucide-react';
import { ApiTest } from '../components/common/ApiTest';

export const Dashboard: React.FC = () => {
  const { datasets, activeDataset } = useDatasets();
  const { chartData, numericCol, categoricalCol, error: chartError } = generateDynamicChartData(activeDataset);
  
  const stats = activeDataset ? analyzeDataset(activeDataset) : null;

  const summaryCards = [
    {
      title: 'Total Datasets',
      value: datasets.length,
      icon: Database,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Active Rows',
      value: stats?.rowCount || 0,
      icon: FileText,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      title: 'Missing Values',
      value: stats?.missingValues || 0,
      icon: AlertCircle,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100'
    },
    {
      title: 'Data Quality',
      value: `${stats && stats.rowCount > 0 ? Math.round(((stats.rowCount * stats.columnCount - stats.missingValues) / (stats.rowCount * stats.columnCount)) * 100) : 0}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Overview of your data management activities
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className={`${card.bgColor} ${card.color} p-3 rounded-lg`}>
                <card.icon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title={numericCol ? `Monthly ${numericCol} Trend` : 'Monthly Trend'} subtitle="Performance over time">
          <div className="h-80">
            {numericCol && !chartError ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name={numericCol}
                    stroke="url(#colorGradient)" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#6366F1" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>{chartError || "No numeric data found to plot a trend."}</p>
              </div>
            )}
          </div>
        </Card>

        <Card title={categoricalCol ? `${categoricalCol} Growth` : 'Monthly Count'} subtitle="Monthly acquisition/count">
          <div className="h-80">
            {categoricalCol && !chartError ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="count" name={`Unique ${categoricalCol}s`} fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>{chartError || "No categorical data found for counting."}</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Active Dataset Info */}
      {activeDataset && (
        <Card title="Active Dataset" subtitle={`Currently working with: ${activeDataset.name}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{stats?.rowCount}</p>
              <p className="text-sm text-gray-600">Total Rows</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{stats?.columnCount}</p>
              <p className="text-sm text-gray-600">Columns</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{stats?.memoryUsage}</p>
              <p className="text-sm text-gray-600">Memory Usage</p>
            </div>
          </div>
        </Card>
      )}

      {/* Backend Integration Test */}
      <Card title="Backend Integration" subtitle="Test the connection between frontend and backend">
        <ApiTest />
      </Card>
    </div>
  );
};