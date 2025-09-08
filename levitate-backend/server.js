// levitate-backend/server.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import uploadRoutes from './routes/uploadRoutes.js';
import dbRoutes from './routes/dbRoutes.js';
import datasetRoutes from './routes/datasetRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();
connectDB();
const app = express();

// --- START: IMPROVED CORS CONFIGURATION ---
// This is the key change to make authentication work.
app.use(cors({
  origin: 'http://localhost:5173', // The origin of your frontend app
  credentials: true, // This allows the server to accept cookies from the browser
}));
// --- END: IMPROVED CORS CONFIGURATION ---

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/connect', dbRoutes);
app.use('/api/datasets', datasetRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
  res.send('Levitate Backend API is running...');
});

const PORT = 2707;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));