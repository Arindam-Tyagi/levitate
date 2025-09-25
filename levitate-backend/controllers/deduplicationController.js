import { findDuplicates, mergeDuplicates } from '../services/deduplicationService.js';
import Dataset from '../models/Dataset.js';

export const getDuplicates = async (req, res) => {
  try {
    const { datasetId, columns, threshold } = req.body;
    if (!datasetId || !columns || columns.length === 0) {
      return res.status(400).json({ message: 'Dataset ID and columns are required.' });
    }

    const duplicates = await findDuplicates(datasetId, columns, threshold);
    res.status(200).json(duplicates);
  } catch (error) {
    res.status(500).json({ message: 'Error finding duplicates.', error: error.message });
  }
};

export const mergeRecords = async (req, res) => {
  try {
    const { datasetId, records } = req.body;
    if (!datasetId || !records || records.length === 0) {
      return res.status(400).json({ message: 'Dataset ID and records to merge are required.' });
    }

    const updatedDataset = await mergeDuplicates(datasetId, records);
    res.status(200).json(updatedDataset);
  } catch (error) {
    res.status(500).json({ message: 'Error merging records.', error: error.message });
  }
};