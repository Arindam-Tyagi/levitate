import { parseFile } from '../utils/fileParser.js';
// Corrected path to the models directory
import Dataset from '../models/Dataset.js';
import fs from 'fs';

export const processAndSaveFile = async (file) => {
  try {
    const { headers, data } = await parseFile(file.path, file.mimetype);
    const newDataset = new Dataset({
      name: file.originalname.replace(/\.[^/.]+$/, ''),
      sourceType: 'upload',
      fileName: file.originalname,
      size: file.size,
      rowCount: data.length,
      columns: headers,
      dataPreview: data.slice(0, 50),
    });
    return await newDataset.save();
  } finally {
    fs.unlinkSync(file.path);
  }
};