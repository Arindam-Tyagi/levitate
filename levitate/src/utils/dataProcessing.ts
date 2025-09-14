import { Dataset, ColumnInfo, DataSummary } from '../types';

export const analyzeDataset = (dataset: Dataset): DataSummary => {
const data = dataset.dataPreview;
const rowCount = dataset.rowCount; // Use rowCount from backend for accuracy
const columnCount = dataset.columns.length;
let missingValues = 0;
data.forEach(row => {
 Object.values(row).forEach(value => {
 if (value === null || value === undefined || value === '') {
 missingValues++;
 }
 });
 });

 // This duplicate check is only on the preview data. For full accuracy, this should be a backend operation.
 const uniqueRows = new Set(data.map(row => JSON.stringify(row)));
 const duplicateRows = data.length - uniqueRows.size;

 const memoryUsage = `${Math.round(dataset.size / 1024)} KB`;

 return {
 rowCount,
 columnCount,
 missingValues,
 duplicateRows,
 memoryUsage
 };
};

export const getColumnInfo = (dataset: Dataset): ColumnInfo[] => {
 return dataset.columns.map(colName => {
 const values = dataset.dataPreview.map(row => row[colName]);
 const nullCount = values.filter(v => v === null || v === undefined || v === '').length;
 const uniqueValues = new Set(values.filter(v => v !== null && v !== undefined && v !== ''));

 let type: 'string' | 'number' | 'date' | 'boolean' = 'string';
 const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');

if (nonNullValues.length > 0) {
 const firstValue = nonNullValues[0];
  if (typeof firstValue === 'number') {
        type = 'number';
      } else if (typeof firstValue === 'boolean') {
        type = 'boolean';
      } else if (typeof firstValue === 'string' && !isNaN(Date.parse(firstValue))) {
        type = 'date';
      }
    }

    return {
      name: colName,
      type,
      nullCount,
      uniqueCount: uniqueValues.size
    };
  });
};

export const removeDuplicates = (dataset: Dataset): Dataset => {
  const uniqueData = dataset.dataPreview.filter((row, index, self) => 
    index === self.findIndex(r => JSON.stringify(r) === JSON.stringify(row))
  );
  return { ...dataset, dataPreview: uniqueData };
};

export const handleMissingValues = (
  dataset: Dataset, 
  action: 'remove' | 'fill', 
  fillValue: any = ''
): Dataset => {
  if (action === 'remove') {
    const cleanData = dataset.dataPreview.filter(row => 
      !Object.values(row).some(value => value === null || value === undefined || value === '')
    );
    return { ...dataset, dataPreview: cleanData };
  }

  if (action === 'fill') {
    const filledData = dataset.dataPreview.map(row => {
      const newRow = { ...row };
      Object.keys(newRow).forEach(key => {
        if (newRow[key] === null || newRow[key] === undefined || newRow[key] === '') {
          newRow[key] = fillValue;
        }
      });
      return newRow;
    });
    return { ...dataset, dataPreview: filledData };
  }

  return dataset;
};

export const exportToCSV = (dataset: Dataset): string => {
  const headers = dataset.columns.join(',');
  const rows = dataset.dataPreview.map(row => 
    dataset.columns.map(col => {
      const value = row[col];
      return typeof value === 'string' && value.includes(',') 
        ? `"${value}"` 
        : value;
    }).join(',')
  );
  
  return [headers, ...rows].join('\n');
};

export const downloadFile = (content: string, filename: string, type: string = 'text/csv') => {
  const blob = new Blob([content], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const generateChartData = (dataset: Dataset | null) => {
    if (!dataset) return [];

    const dateColumn = dataset.columns.find(col => col.toLowerCase().includes('date'));
    const revenueColumn = dataset.columns.find(col => col.toLowerCase().includes('revenue'));
    const customerColumn = dataset.columns.find(col => col.toLowerCase().includes('customer'));

    if (!dateColumn || !revenueColumn || !customerColumn) return [];

    const monthlyData = dataset.dataPreview.reduce((acc, row) => {
        try {
            const date = new Date(row[dateColumn]);
            const month = date.toLocaleString('default', { month: 'short' });
            const year = date.getFullYear();
            const key = `${year}-${month}`;

            if (!acc[key]) {
                acc[key] = { month, revenue: 0, customers: new Set() };
            }

            acc[key].revenue += parseFloat(row[revenueColumn]) || 0;
            acc[key].customers.add(row[customerColumn]);

            return acc;
        } catch (error) {
            return acc;
        }
    }, {} as Record<string, { month: string; revenue: number; customers: Set<any> }>);

    return Object.values(monthlyData).map(d => ({
        month: d.month,
        revenue: d.revenue,
        customers: d.customers.size
    }));
};