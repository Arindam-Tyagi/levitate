import Groq from 'groq-sdk';
import Dataset from '../models/Dataset.js';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Generates insights for a given dataset using the Groq API.
 * @param {string} datasetId The ID of the dataset to analyze.
 * @returns {Promise<string>} The generated insight as a string.
 */
export const generateInsightWithGroq = async (datasetId) => {
  if (!datasetId) {
    throw new Error('Dataset ID is required.');
  }

  const dataset = await Dataset.findById(datasetId);
  if (!dataset) {
    throw new Error('Dataset not found.');
  }

  // Use a stringified preview of the data to send to the AI
  const dataPreview = JSON.stringify(dataset.dataPreview);

  const prompt = `
    As a senior data analyst, analyze the following dataset preview and provide a concise, actionable insight.
    The dataset is named "${dataset.name}" and has the following columns: ${dataset.columns.join(', ')}.
    
    Here is a preview of the first few rows (in JSON format):
    ${dataPreview}

    Based on this data, identify one significant trend, anomaly, or data quality issue. 
    Keep your response to a single paragraph. Start your response with "Insight:"
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'meta-llama/llama-guard-4-12b', // A fast and capable model
      temperature: 0.7,
      max_tokens: 250,
    });

    return chatCompletion.choices[0]?.message?.content || 'No insight could be generated.';
  } catch (error) {
    console.error('Error calling Groq API:', error);
    throw new Error('Failed to generate insights from Groq API.');
  }
};