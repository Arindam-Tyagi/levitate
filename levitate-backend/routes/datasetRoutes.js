import express from 'express';
// Corrected path to the controllers directory
import { getAllDatasets } from '../controllers/datasetControllers.js';

const router = express.Router();

// GET /api/datasets
router.get('/', getAllDatasets);

export default router;