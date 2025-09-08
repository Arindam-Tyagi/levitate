// levitate-backend/routes/uploadRoutes.js

import express from 'express';
import multer from 'multer';
import { uploadFile } from '../controllers/uploadController.js';
import { protect } from '../middleware/authMiddleware.js'; // Import protect

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Add the 'protect' middleware before the controller function
router.post('/', protect, upload.single('file'), uploadFile);

export default router;