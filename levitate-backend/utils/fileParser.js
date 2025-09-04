import fs from 'fs';
import xlsx from 'xlsx';
import csv from 'csv-parser';

export const parseFile = (filePath, mimeType) => new Promise((resolve, reject) => {
  try {
    if (mimeType === 'text/csv') {
      const data = [];
      fs.createReadStream(filePath).pipe(csv())
        .on('data', (row) => data.push(row))
        .on('end', () => {
          if (!data.length) return reject(new Error('CSV is empty.'));
          resolve({ headers: Object.keys(data[0]), data });
        });
    } else if (mimeType.includes('sheet') || mimeType.includes('excel')) {
      const workbook = xlsx.readFile(filePath);
      const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      if (!data.length) return reject(new Error('Excel sheet is empty.'));
      resolve({ headers: Object.keys(data[0]), data });
    } else {
      reject(new Error('Unsupported file type.'));
    }
  } catch (error) {
    reject(error);
  }
});