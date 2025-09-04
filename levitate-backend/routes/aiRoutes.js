import express from 'express';
import { generateInsights } from '../controllers/aiController.js';

const router = express.Router();

// POST /api/ai/generate-insights
router.post('/generate-insights', generateInsights);

export default router;