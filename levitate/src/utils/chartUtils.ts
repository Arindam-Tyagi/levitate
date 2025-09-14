import { Dataset } from '../types';

// Helper to identify potential columns for charting
const identifyChartColumns = (dataset: Dataset) => {
  const columns = dataset.columns.map(c => c.toLowerCase());
  
  // Find the first column that looks like a date
  const dateCol = dataset.columns.find(c => ['date', 'time', 'timestamp'].some(key => c.toLowerCase().includes(key)));

  // Find the first column that looks numeric and is not an ID
  const numericCol = dataset.columns.find(c => {
    const lowerC = c.toLowerCase();
    if (lowerC.includes('id') || lowerC.includes('identifier')) return false;
    // Check if at least one value in the preview is a number
    return dataset.dataPreview.some(row => typeof row[c] === 'number');
  });

  // Find the first column that looks like a categorical ID for counting
  const categoricalCol = dataset.columns.find(c => ['id', 'customer', 'user', 'product', 'order'].some(key => c.toLowerCase().includes(key)));

  return { dateCol, numericCol, categoricalCol };
};


// Main function to generate chart data and metadata
export const generateDynamicChartData = (dataset: Dataset | null) => {
  if (!dataset || dataset.dataPreview.length === 0) {
    return { chartData: [], numericCol: null, categoricalCol: null, error: "No active dataset." };
  }

  const { dateCol, numericCol, categoricalCol } = identifyChartColumns(dataset);

  if (!dateCol) {
    return { chartData: [], numericCol, categoricalCol, error: "No date-like column found for trend analysis." };
  }
  
  if (!numericCol && !categoricalCol) {
    return { chartData: [], numericCol, categoricalCol, error: "No suitable numeric or categorical column found to plot." };
  }

  const monthlyData = dataset.dataPreview.reduce((acc, row) => {
    try {
      const date = new Date(row[dateCol]);
      // Check for invalid date
      if (isNaN(date.getTime())) return acc;

      const month = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      
      if (!acc[month]) {
        acc[month] = { 
          month, 
          numericValue: 0, 
          categories: new Set() 
        };
      }

      if (numericCol) {
        acc[month].numericValue += parseFloat(row[numericCol]) || 0;
      }
      if (categoricalCol) {
        acc[month].categories.add(row[categoricalCol]);
      }

      return acc;
    } catch (error) {
      // Ignore rows with parsing errors
      return acc;
    }
  }, {} as Record<string, { month: string; numericValue: number; categories: Set<any> }>);
  
  const chartData = Object.values(monthlyData).map(d => ({
    month: d.month,
    value: d.numericValue,
    count: d.categories.size
  }));

  // Sort by date to ensure the line chart is correct
  chartData.sort((a, b) => new Date(`1 ${a.month}`).getTime() - new Date(`1 ${b.month}`).getTime());

  return { chartData, numericCol, categoricalCol, error: null };
};