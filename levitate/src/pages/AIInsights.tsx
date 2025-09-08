import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useDatasets } from '../hooks/useDatasets';
import { Brain, Lightbulb, RefreshCw, TrendingUp, AlertCircle } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

export const AIInsights: React.FC = () => {
  const { activeDataset } = useDatasets();
  const [isGenerating, setIsGenerating] = useState(false);
  const [insight, setInsight] = useState<string | null>(null); // State for the insight string

  const generateInsights = async () => {
    if (!activeDataset) return;

    setIsGenerating(true);
    setInsight(null); // Clear previous insight
    
    try {
      const response = await fetch(API_ENDPOINTS.GENERATE_INSIGHTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ datasetId: activeDataset._id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch insights from the server.');
      }

      const result = await response.json();
      setInsight(result.insight);

    } catch (error) {
      console.error("Error generating insights:", error);
      setInsight("Sorry, an error occurred while generating the insight. Please check the server connection and ensure your API key is valid.");
    } finally {
      setIsGenerating(false);
    }
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
      {/* Header and Generate Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Insights</h1>
          <p className="text-gray-600 mt-2">
            AI-powered analysis and recommendations for: {activeDataset.name}
          </p>
        </div>
        <Button onClick={generateInsights} disabled={isGenerating} variant="primary">
          {isGenerating ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Brain className="h-4 w-4 mr-2" />
          )}
          {isGenerating ? 'Generating...' : 'Generate Insights'}
        </Button>
      </div>

      {/* AI Status Card */}
      <Card title="AI Analysis Status">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <h3 className="font-semibold text-gray-900">Groq AI Analysis Engine</h3>
              <p className="text-gray-600">
                {isGenerating ? 'Analyzing your data via Groq...' : 'Ready to analyze your dataset'}
              </p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isGenerating 
              ? 'bg-amber-100 text-amber-800' 
              : insight
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {isGenerating ? 'Processing' : insight ? 'Completed' : 'Idle'}
          </div>
        </div>
      </Card>

      {/* Display Generated Insight */}
      {insight && !isGenerating && (
        <Card title="Generated Insight" className="bg-blue-50 border-blue-200">
           <div className="flex items-start">
             <div className="bg-blue-100 text-blue-600 p-3 rounded-lg mr-4">
               <Lightbulb className="h-6 w-6" />
             </div>
             <div className="flex-1">
               <p className="text-gray-800 whitespace-pre-wrap">{insight}</p>
             </div>
           </div>
        </Card>
      )}
      
      {/* Placeholder when no insights are generated yet */}
      {!insight && !isGenerating && (
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