// backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import gameRoutes from './routes/gameRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",                  // local dev (Vite usually runs here)
  "https://event-app-hww2.vercel.app",  
  "https://iimcal-ac-in.vercel.app",
  "http://localhost:4173",                 // your Vercel frontend
  "https://event-app-eight-dusky.vercel.app" // if that’s another deployment
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
