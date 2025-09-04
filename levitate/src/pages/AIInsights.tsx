import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useDatasets } from '../hooks/useDatasets';
import { Brain, TrendingUp, AlertCircle, Lightbulb, RefreshCw } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api'; // Import API_ENDPOINTS

export const AIInsights: React.FC = () => {
  const { activeDataset } = useDatasets();
  const [isGenerating, setIsGenerating] = useState(false);
  const [insights, setInsights] = useState<string | null>(null);

  const generateInsights = async () => { // Make function async
    if (!activeDataset) return;


    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const mockInsights = [
        {
          type: 'trend',
          title: 'Revenue Growth Pattern',
          description: 'Your revenue shows a consistent upward trend with 23% month-over-month growth.',
          confidence: 92,
          icon: TrendingUp,
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-100'
        },
        {
          type: 'anomaly',
          title: 'Data Quality Issue',
          description: 'Detected 15 outlier values in the revenue column that may require attention.',
          confidence: 87,
          icon: AlertCircle,
          color: 'text-amber-600',
          bgColor: 'bg-amber-100'
        },
        {
          type: 'recommendation',
          title: 'Optimization Opportunity',
          description: 'Consider normalizing date formats for improved data consistency across columns.',
          confidence: 78,
          icon: Lightbulb,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100'
        }
      ];

      setInsights(mockInsights);
      setIsGenerating(false);
    }, 3000);
  };

  if (!activeDataset) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Insights</h1>
          <p className="text-gray-600 mt-2">
            No dataset selected. Please upload a dataset to generate insights.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Insights</h1>
          <p className="text-gray-600 mt-2">
            AI-powered analysis and recommendations for: {activeDataset.name}
          </p>
        </div>
        
        <Button
          onClick={generateInsights}
          disabled={isGenerating}
          variant="primary"
        >
          {isGenerating ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Brain className="h-4 w-4 mr-2" />
          )}
          {isGenerating ? 'Generating...' : 'Generate Insights'}
        </Button>
      </div>

      {/* AI Status */}
      <Card title="AI Analysis Status">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <h3 className="font-semibold text-gray-900">AI Analysis Engine</h3>
              <p className="text-gray-600">
                {isGenerating ? 'Processing your data...' : 'Ready to analyze your dataset'}
              </p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isGenerating 
              ? 'bg-amber-100 text-amber-800' 
              : insights.length > 0 
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-gray-100 text-gray-800'
          }`}>
            {isGenerating ? 'Processing' : insights.length > 0 ? 'Completed' : 'Idle'}
          </div>
        </div>
      </Card>

      {/* Generated Insights */}
      {insights.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Generated Insights</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {insights.map((insight, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start">
                  <div className={`${insight.bgColor} ${insight.color} p-3 rounded-lg mr-4`}>
                    <insight.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{insight.title}</h3>
                    <p className="text-gray-700 mb-3">{insight.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {insight.type}
                      </span>
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${insight.confidence}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{insight.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Placeholder when no insights */}
      {insights.length === 0 && !isGenerating && (
        <Card>
          <div className="text-center py-12">
            <Brain className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Insights Generated Yet</h3>
            <p className="text-gray-600 mb-6">
              Click "Generate Insights" to let our AI analyze your dataset and provide recommendations.
            </p>
            <Button onClick={generateInsights} variant="primary">
              <Brain className="h-4 w-4 mr-2" />
              Start AI Analysis
            </Button>
          </div>
        </Card>
      )}

      {/* Feature Overview */}
      <Card title="AI Capabilities" subtitle="What our AI can help you discover">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-emerald-100 text-emerald-600 p-4 rounded-lg mb-4 inline-block">
              <TrendingUp className="h-8 w-8" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Trend Analysis</h4>
            <p className="text-sm text-gray-600">
              Identify patterns, growth trends, and seasonal variations in your data.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-amber-100 text-amber-600 p-4 rounded-lg mb-4 inline-block">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Anomaly Detection</h4>
            <p className="text-sm text-gray-600">
              Spot outliers, inconsistencies, and data quality issues automatically.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 text-blue-600 p-4 rounded-lg mb-4 inline-block">
              <Lightbulb className="h-8 w-8" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Smart Recommendations</h4>
            <p className="text-sm text-gray-600">
              Get actionable suggestions for data cleaning and optimization.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};