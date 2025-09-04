// Corrected path to the services directory
import { fetchAllDatasets } from '../services/datasetService.js';

export const getAllDatasets = async (req, res) => {
  try {
    const datasets = await fetchAllDatasets();
    res.status(200).json(datasets);
  } catch (error) {
    console.error('Error fetching datasets:', error);
    res.status(500).json({ message: 'Error fetching datasets.', error: error.message });
  }
};