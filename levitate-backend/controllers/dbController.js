// Corrected path
import { connectAndFetchData } from '../services/dbService.js';

export const connectExternalDB = async (req, res) => {
  try {
    const credentials = req.body;
    if (!credentials.dbType || !credentials.host || !credentials.database || !credentials.table) {
      return res.status(400).json({ message: 'Missing required credentials.' });
    }
    const dataset = await connectAndFetchData(credentials);
    res.status(201).json({ message: 'Successfully connected and fetched data.', dataset });
  } catch (error) {
    res.status(500).json({ message: 'Failed to connect.', error: error.message });
  }
};