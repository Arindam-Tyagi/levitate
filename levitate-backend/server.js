import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // 1. Import cookie-parser
import connectDB from './config/db.js';

// ... import all your route files
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import dbRoutes from './routes/dbRoutes.js';
import datasetRoutes from './routes/datasetRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import deduplicationRoutes from './routes/deduplicationRoutes.js';

dotenv.config();
connectDB();
const app = express();

// --- START: Updated Middleware Configuration ---

// 2. Configure CORS to allow your frontend origin and credentials
const corsOptions = {
  origin: 'http://localhost:5173', // Your React app's address
  credentials: true,
};
app.use(cors(corsOptions));

// 3. Use cookie-parser BEFORE any of your routes
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- END: Updated Middleware Configuration ---


// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/connect', dbRoutes);
app.use('/api/datasets', datasetRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/deduplication', deduplicationRoutes);

app.get('/', (req, res) => {
  res.send('Levitate Backend API is running...');
});

const PORT = process.env.PORT || 2707;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));