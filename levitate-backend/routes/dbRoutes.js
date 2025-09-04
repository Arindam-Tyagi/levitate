import express from 'express';
// Corrected path
import { connectExternalDB } from '../controllers/dbController.js';

const router = express.Router();

router.post('/db', connectExternalDB);

export default router;