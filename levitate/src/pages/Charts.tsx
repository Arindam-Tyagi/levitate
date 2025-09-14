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
  Cell
} from 'recharts';
import { Card } from '../components/ui/Card';
import { useDatasets } from '../hooks/useDatasets';
import { generateDynamicChartData } from '../utils/chartUtils';
import { TrendingUp, PieChart as PieChartIcon, BarChart3, Activity } from 'lucide-react';

export const Charts: React.FC = () => {
  const { activeDataset } = useDatasets();
  const { chartData, numericCol, categoricalCol, error: chartError } = generateDynamicChartData(activeDataset);
  
  // Sample data for pie chart (can be made dynamic in a similar fashion if needed)
  const pieData = [
    { name: 'Desktop', value: 45, color: '#3B82F6' },
    { name: 'Mobile', value: 35, color: '#10B981' },
    { name: 'Tablet', value: 20, color: '#F59E0B' }
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
        {/* Trend Line Chart */}
        <Card title={numericCol ? `${numericCol} Trend` : 'Monthly Trend'} subtitle="Performance over time">
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
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>{chartError || "No suitable numeric data found."}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Count Bar Chart */}
        <Card title={categoricalCol ? `Growth of ${categoricalCol}` : 'Monthly Count'} subtitle="Monthly item acquisition">
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
                <p>{chartError || "No suitable categorical data found."}</p>
              </div>
            )}
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
      </div>
    </div>
  );
};