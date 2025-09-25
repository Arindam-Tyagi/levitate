import express from 'express';
import { getDuplicates, mergeRecords } from '../controllers/deduplicationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/find', protect, getDuplicates);
router.post('/merge', protect, mergeRecords);

export default router;