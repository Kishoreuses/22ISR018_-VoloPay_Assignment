import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import routes from './routes';
import { connectDB } from './db';
import { ensureSeeded } from './store';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup: allow all origins in production/serverless, or specific frontend
app.use(cors({
  origin: (origin, callback) => {
    // Allow all origins (standard for public API / Vercel frontend previews)
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serverless DB connection middleware
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
    await ensureSeeded();
  } catch (err) {
    console.error('DB init middleware warning:', err);
  }
  next();
});

// Root route
app.get('/', (_req, res) => {
  res.json({
    name: 'Friends of Finance Community CRM API',
    status: 'online',
    db: mongoose.connection.readyState === 1 ? 'MongoDB Atlas Connected' : 'In-Memory Store',
    version: '1.0.0',
    endpoints: [
      '/api/dashboard',
      '/api/members',
      '/api/activities',
      '/api/invitees',
      '/api/recommendations'
    ]
  });
});

// API Routes
app.use('/api', routes);

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'MongoDB Connected' : 'In-Memory Fallback',
    timestamp: new Date().toISOString()
  });
});

// In local mode (not Vercel serverless), listen on port
if (!process.env.VERCEL) {
  connectDB().then(() => {
    ensureSeeded().catch(console.error);
  });
  app.listen(PORT, () => {
    console.log(`🚀 FoF CRM Backend running at http://localhost:${PORT}`);
    console.log(`📋 API: http://localhost:${PORT}/api`);
  });
}

export default app;
