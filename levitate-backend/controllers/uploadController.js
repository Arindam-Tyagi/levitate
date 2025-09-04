// Corrected path
import { processAndSaveFile } from '../services/fileService.js';

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    const dataset = await processAndSaveFile(req.file);
    res.status(201).json({
      message: 'File uploaded successfully!',
      dataset,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing file.', error: error.message });
  }
};