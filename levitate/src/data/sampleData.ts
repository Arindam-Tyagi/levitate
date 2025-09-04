import { Dataset } from '../types';

export const sampleDatasets: Dataset[] = [
  {
    id: '1',
    name: 'Sales Data Q1 2024',
    columns: ['id', 'product', 'revenue', 'date', 'region'],
    data: [
      { id: 1, product: 'Laptop Pro', revenue: 1299.99, date: '2024-01-15', region: 'North' },
      { id: 2, product: 'Smartphone X', revenue: 899.99, date: '2024-01-16', region: 'South' },
      { id: 3, product: 'Tablet Air', revenue: 599.99, date: '2024-01-17', region: 'East' },
      { id: 4, product: 'Laptop Pro', revenue: 1299.99, date: '2024-01-18', region: 'West' },
      { id: 5, product: 'Headphones', revenue: 199.99, date: '2024-01-19', region: 'North' },
      { id: 6, product: 'Smart Watch', revenue: 399.99, date: '2024-01-20', region: null },
      { id: 7, product: 'Keyboard', revenue: 89.99, date: '2024-01-21', region: 'South' },
      { id: 8, product: 'Mouse', revenue: 49.99, date: '2024-01-22', region: 'East' },
      { id: 9, product: 'Monitor', revenue: 329.99, date: null, region: 'West' },
      { id: 10, product: 'Speaker', revenue: 149.99, date: '2024-01-24', region: 'North' }
    ],
    uploadedAt: new Date('2024-01-01'),
    size: 2048
  },
  {
    id: '2',
    name: 'Customer Demographics',
    columns: ['customer_id', 'age', 'gender', 'location', 'lifetime_value'],
    data: [
      { customer_id: 101, age: 28, gender: 'F', location: 'New York', lifetime_value: 2500.50 },
      { customer_id: 102, age: 34, gender: 'M', location: 'California', lifetime_value: 1800.25 },
      { customer_id: 103, age: null, gender: 'F', location: 'Texas', lifetime_value: 3200.75 },
      { customer_id: 104, age: 45, gender: 'M', location: 'Florida', lifetime_value: 1950.00 },
      { customer_id: 105, age: 29, gender: 'F', location: 'Illinois', lifetime_value: 2750.30 }
    ],
    uploadedAt: new Date('2024-01-05'),
    size: 1024
  }
];

export const generateChartData = () => [
  { month: 'Jan', revenue: 12500, customers: 245 },
  { month: 'Feb', revenue: 15800, customers: 289 },
  { month: 'Mar', revenue: 18200, customers: 324 },
  { month: 'Apr', revenue: 16900, customers: 298 },
  { month: 'May', revenue: 21400, customers: 387 },
  { month: 'Jun', revenue: 19800, customers: 356 }
];