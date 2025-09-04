import { fetchDataFromDB } from '../utils/dbConnector.js';
// Corrected path to the models directory
import Dataset from '../models/Dataset.js';

export const connectAndFetchData = async (credentials) => {
  const { headers, data } = await fetchDataFromDB(credentials);
  const newDataset = new Dataset({
    name: `${credentials.database}.${credentials.table}`,
    sourceType: 'database',
    rowCount: data.length,
    columns: headers,
    dataPreview: data,
  });
  return await newDataset.save();
};