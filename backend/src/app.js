// backend/src/app.js
import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import passport from 'passport';

import authRoutes from './routes/auth.js';
import apiRoutes  from './routes/api.js';

dotenv.config();

const app = express();

/* ---------- Middleware ---------- */
app.use(express.json());
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
  methods: ['GET','POST','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));
app.use(passport.initialize());

/* ---------- Routes ---------- */
app.use('/auth', authRoutes);
app.use('/api',  apiRoutes);

/* ---------- Health check ---------- */
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

export default app;
