import { generateInsightWithGroq } from '../services/aiService.js';

export const generateInsights = async (req, res) => {
  try {
    const { datasetId } = req.body;
    if (!datasetId) {
      return res.status(400).json({ message: 'A datasetId is required.' });
    }
    const insight = await generateInsightWithGroq(datasetId);
    res.status(200).json({ insight });
  } catch (error) {
    console.error('Error in AI controller:', error);
    res.status(500).json({ message: 'Error generating AI insight.', error: error.message });
  }
};