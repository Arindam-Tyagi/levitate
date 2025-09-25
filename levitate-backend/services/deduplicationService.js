import FuzzySearch from 'fuzzy-search';
import Dataset from '../models/Dataset.js';

const findDuplicates = async (datasetId, columns, threshold = 0.8) => {
  const dataset = await Dataset.findById(datasetId);
  if (!dataset) {
    throw new Error('Dataset not found.');
  }

  const searcher = new FuzzySearch(dataset.dataPreview, columns, {
    caseSensitive: false,
  });

  const duplicates = new Map();
  const processedIds = new Set();

  for (const record of dataset.dataPreview) {
    const recordId = record._id.toString();
    if (processedIds.has(recordId)) {
      continue;
    }

    const results = searcher.search(record[columns[0]]);
    const similarRecords = results.filter(result => result._id.toString() !== recordId);

    if (similarRecords.length > 0) {
      const group = [record, ...similarRecords];
      const groupId = recordId;
      duplicates.set(groupId, group);
      group.forEach(r => processedIds.add(r._id.toString()));
    }
  }

  return Array.from(duplicates.values());
};

const mergeDuplicates = async (datasetId, duplicatesToMerge) => {
  const dataset = await Dataset.findById(datasetId);
  if (!dataset) {
    throw new Error('Dataset not found');
  }

  const mergedRecord = duplicatesToMerge.reduce((acc, record) => {
    for (const key in record) {
      if (acc[key] === null || acc[key] === undefined) {
        acc[key] = record[key];
      }
    }
    return acc;
  }, {});

  const idsToDelete = duplicatesToMerge.map(d => d._id);
  dataset.dataPreview = dataset.dataPreview.filter(
    record => !idsToDelete.includes(record._id)
  );
  dataset.dataPreview.push(mergedRecord);

  await dataset.save();
  return dataset;
};

export { findDuplicates, mergeDuplicates };