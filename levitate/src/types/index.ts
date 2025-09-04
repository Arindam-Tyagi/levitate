export interface Dataset {
   _id: string; // Changed from id
  name: string;
  columns: string[];
  dataPreview: Record<string, any>[]; // Changed from data
  createdAt: string; // Changed from uploadedAt and is now a string
  size: number;
  rowCount: number;
  sourceType: 'upload' | 'database';
  fileName?: string;
}

export interface ColumnInfo {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  nullCount: number;
  uniqueCount: number;
}

export interface DataSummary {
  rowCount: number;
  columnCount: number;
  missingValues: number;
  duplicateRows: number;
  memoryUsage: string;
}

export interface MergeConfig {
  leftDataset: string;
  rightDataset: string;
  joinKey: string;
  joinType: 'inner' | 'left' | 'right' | 'outer';
}