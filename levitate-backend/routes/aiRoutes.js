// levitate-backend/routes/aiRoutes.js

import express from 'express';
import { generateInsights } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js'; // Import protect

const router = express.Router();

// Add the 'protect' middleware
router.post('/generate-insights', protect, generateInsights);

export default router;