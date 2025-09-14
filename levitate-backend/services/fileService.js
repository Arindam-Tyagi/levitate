import { parseFile } from '../utils/fileParser.js';
import Dataset from '../models/Dataset.js';
import fs from 'fs';

export const processAndSaveFile = async (file, userId) => { // 1. Accept userId
  try {
    const { headers, data } = await parseFile(file.path, file.mimetype);
    const newDataset = new Dataset({
      user: userId, // 2. Add the user ID here
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