import { useState, useCallback, useEffect } from 'react';
import { Dataset } from '../types';
import { API_ENDPOINTS } from '../config/api';

export const useDatasets = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [activeDataset, setActiveDataset] = useState<Dataset | null>(null);

  // Fetch initial datasets from the backend when the component mounts
  useEffect(() => {
    const fetchInitialDatasets = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.DATASETS);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Dataset[] = await response.json();
        setDatasets(data);
        if (data.length > 0) {
          setActiveDataset(data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch datasets:", error);
      }
    };

    fetchInitialDatasets();
  }, []);

  const addDataset = useCallback((dataset: Dataset) => {
    setDatasets(prev => [dataset, ...prev]);
    setActiveDataset(dataset);
  }, []);

  const updateDataset = useCallback((id: string, updatedDataset: Dataset) => {
    setDatasets(prev => prev.map(d => d.id === id ? updatedDataset : d));
    if (activeDataset?.id === id) {
      setActiveDataset(updatedDataset);
    }
  }, [activeDataset?.id]);

  const removeDataset = useCallback((id: string) => {
    const remaining = datasets.filter(d => d.id !== id);
    setDatasets(remaining);
    if (activeDataset?.id === id) {
      setActiveDataset(remaining[0] || null);
    }
  }, [activeDataset?.id, datasets]);

  return {
    datasets,
    activeDataset,
    setActiveDataset,
    addDataset,
    updateDataset,
    removeDataset
  };
};