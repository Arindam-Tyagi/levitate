// Corrected path to the models directory
import Dataset from '../models/Dataset.js';

/**
 * Fetches all datasets from the database.
 * @returns {Promise<Array>} A list of all datasets.
 */
export const fetchAllDatasets = async () => {
  // We sort by createdAt descending to show the newest datasets first
  return await Dataset.find({}).sort({ createdAt: -1 });
};