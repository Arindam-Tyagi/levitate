// levitate-backend/services/aiService.js

import Groq from 'groq-sdk';
import Dataset from '../models/Dataset.js';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateInsightWithGroq = async (datasetId) => {
  if (!datasetId) {
    throw new Error('Dataset ID is required.');
  }

  const dataset = await Dataset.findById(datasetId);
  if (!dataset) {
    throw new Error('Dataset not found.');
  }

  // Slice the data preview to the first 10 rows before stringifying
  const dataPreview = JSON.stringify(dataset.dataPreview.slice(0, 10));

  const prompt = `
   As a senior data analyst, analyze the following dataset preview and provide three concise, actionable insights in a bulleted list.
    The dataset is named "${dataset.name}" and has these columns: ${dataset.columns.join(', ')}.

    Here is a preview of the first 10 rows (in JSON format):
    ${dataPreview}

    Based on this data, identify at least three significant trends, anomalies, or data quality issues.
    - Start each point with a bullet character (* or -).
    - Each point should be a single, complete sentence.
    - Do not add any introductory text or a title.
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 250,
    });

    return chatCompletion.choices[0]?.message?.content || 'No insight could be generated.';
  } catch (error) {
    console.error('Error calling Groq API:', error);
    throw new Error('Failed to generate insights from Groq API.');
  }
};