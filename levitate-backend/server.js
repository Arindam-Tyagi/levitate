import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import uploadRoutes from './routes/uploadRoutes.js';
import dbRoutes from './routes/dbRoutes.js';
import datasetRoutes from './routes/datasetRoutes.js'; // 1. Import the new route
import aiRoutes from './routes/aiRoutes.js'; 

dotenv.config();
connectDB();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/connect', dbRoutes);
app.use('/api/datasets', datasetRoutes); // 2. Use the new route
app.use('/api/ai', aiRoutes); // 2. Use the new route

app.get('/', (req, res) => {
  res.send('Levitate Backend API is running...');
});

const PORT = 2707; // Hardcoded to avoid environment conflicts
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));