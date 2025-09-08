// levitate-backend/routes/datasetRoutes.js

import express from 'express';
import { getAllDatasets } from '../controllers/datasetControllers.js';
import { protect } from '../middleware/authMiddleware.js'; // Import protect

const router = express.Router();

// Add the 'protect' middleware
router.get('/', protect, getAllDatasets);

export default router;