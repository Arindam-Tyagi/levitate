import { processAndSaveFile } from '../services/fileService.js';

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    // Pass the user ID from req.user (added by the 'protect' middleware)
    const dataset = await processAndSaveFile(req.file, req.user._id); 
    res.status(201).json({
      message: 'File uploaded successfully!',
      dataset,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing file.', error: error.message });
  }
};