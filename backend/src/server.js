import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import {createServer} from 'http';
import path from 'path';
import {fileURLToPath} from 'url';

import app from './app.js';

//add passport for OAuth
import passport from './config/passport.js';
import authRoutes from './config/authRoutes.js';

// import compression from 'compression';
import serveStatic from 'serve-static';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


/* 1. Static files */
app.use(
  serveStatic(path.join(__dirname, '../../dist'), {
    maxAge: '365d',
    immutable: true,
  })
);

// 2. server initialization
const PORT = process.env.PORT || 3000;
const server = createServer(app);

// 3. Middleware
app.use(helmet());

// allow CORS from specific origins
// process.env.ALLOWED_ORIGINS should be a comma-separated string of allowed origins
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(rateLimit({windowMs: 15 * 60 * 1000, max: 100}));

// json and urlencoded body parsers
// express.json() parses incoming requests with JSON payloads
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const ALLOWED = [
  'http://localhost:5500',
  'http://127.0.0.1:5500', 
  process.env.FRONTEND_URL,
].filter(Boolean);

// Initialize passport for OAuth
app.use(passport.initialize());


/* Mount routes OAuth */
app.use('/auth', authRoutes);

/* 5. Health check */
app.get('/api/health', (req, res) => res.json({status: 'ok'}));

/* 6. Default routes */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist', 'index.html'));
});

/* 7. Server initialization */
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

/* 8. Graceful shutdown */
const shutdown = (signal) => {
  console.log(`Received ${signal}. Closing server...`);
  server.close(() => {
    console.log('Server closed. Exiting process.');
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

export default server;
