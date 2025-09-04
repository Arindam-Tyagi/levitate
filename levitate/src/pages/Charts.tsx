import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter
} from 'recharts';
import { Card } from '../components/ui/Card';
import { useDatasets } from '../hooks/useDatasets';
import { generateChartData } from '../data/sampleData';
import { TrendingUp, PieChart as PieChartIcon, BarChart3, Activity } from 'lucide-react';

export const Charts: React.FC = () => {
  const { activeDataset } = useDatasets();
  const chartData = generateChartData();
  
  // Sample data for different chart types
  const pieData = [
    { name: 'Desktop', value: 45, color: '#3B82F6' },
    { name: 'Mobile', value: 35, color: '#10B981' },
    { name: 'Tablet', value: 20, color: '#F59E0B' }
  ];

  const scatterData = [
    { x: 100, y: 200, z: 200 },
    { x: 120, y: 100, z: 260 },
    { x: 170, y: 300, z: 400 },
    { x: 140, y: 250, z: 280 },
    { x: 150, y: 400, z: 500 },
    { x: 110, y: 280, z: 200 }
  ];

  if (!activeDataset) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Charts & Visualization</h1>
          <p className="text-gray-600 mt-2">
            No dataset selected. Please upload a dataset to create visualizations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Charts & Visualization</h1>
        <p className="text-gray-600 mt-2">
          Visual insights from your data: {activeDataset.name}
        </p>
      </div>

      {/* Chart Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
          <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <h3 className="font-medium text-gray-900">Line Charts</h3>
          <p className="text-sm text-gray-600">Trends over time</p>
        </Card>
        
        <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
          <BarChart3 className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
          <h3 className="font-medium text-gray-900">Bar Charts</h3>
          <p className="text-sm text-gray-600">Compare categories</p>
        </Card>
        
        <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
          <PieChartIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <h3 className="font-medium text-gray-900">Pie Charts</h3>
          <p className="text-sm text-gray-600">Part-to-whole relationships</p>
        </Card>
        
        <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
          <Activity className="h-8 w-8 text-orange-600 mx-auto mb-2" />
          <h3 className="font-medium text-gray-900">Scatter Plots</h3>
          <p className="text-sm text-gray-600">Variable relationships</p>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trend Line Chart */}
        <Card title="Revenue Trend" subtitle="Monthly performance over time">
          <div className="h-80">
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
                  dataKey="revenue" 
                  stroke="url(#colorGradient)" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: '#1D4ED8' }}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Customer Count Bar Chart */}
        <Card title="Customer Growth" subtitle="Monthly customer acquisition">
          <div className="h-80">
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
                <Bar dataKey="customers" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Traffic Source Pie Chart */}
        <Card title="Traffic Sources" subtitle="Distribution of user devices">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={40}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Scatter Plot */}
        <Card title="Performance Correlation" subtitle="Revenue vs Customer relationship">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={scatterData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="x" stroke="#666" />
                <YAxis dataKey="y" stroke="#666" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Scatter dataKey="z" fill="#8B5CF6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card title="Data Summary" subtitle="Quick statistics from your active dataset">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{activeDataset.rowCount}</p>
            <p className="text-sm text-gray-600">Total Records</p>
          </div>
          
          <div className="text-center p-4 bg-emerald-50 rounded-lg">
            <p className="text-2xl font-bold text-emerald-600">{activeDataset.columns.length}</p>
            <p className="text-sm text-gray-600">Columns</p>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {Math.round(activeDataset.size / 1024)}KB
            </p>
            <p className="text-sm text-gray-600">File Size</p>
          </div>

          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">
              {new Date(activeDataset.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">Last Updated</p>
          </div>
        </div>
      </Card>
    </div>
  );
};