// backend/src/server.js
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

import app from './app.js';

// ✨ Thêm passport & authRoutes
import passport from './config/passport.js';
import authRoutes from './config/authRoutes.js';



// import compression from 'compression';
import serveStatic from 'serve-static';
// import path from 'path';
// import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// app.use(compression());  // nén brotli/gzip

// phục vụ thư mục dist/ build sẵn
app.use(
  serveStatic(path.join(__dirname, '../../dist'), {
    maxAge: '365d',
    immutable: true
  })
);


/* 2. Tạo server */
const PORT = process.env.PORT || 3000;
const server = createServer(app);

/* 3. Middleware bảo mật / CORS / rate-limit */
app.use(helmet());



// ✨ Cho phép nhiều origin (dev/prod) + cookie
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type','Authorization']
}));


app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

/* ✨ JSON-parser nếu cần nhận body */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ALLOWED = [
  'http://localhost:5500',
  'http://127.0.0.1:5500',    // thêm dòng này
  process.env.FRONTEND_URL    // nếu deploy
].filter(Boolean);

/* ✨ Khởi động Passport – phải đặt TRƯỚC routes OAuth */
app.use(passport.initialize());

/* 4. Static files */
// app.use(express.static(path.join(__dirname, '..', 'public')));

/* ✨ Mount routes OAuth */
app.use('/auth', authRoutes);

/* 5. Health check */
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

/* 6. Route mặc định */
app.get('/', (req, res) => {
  // res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  res.sendFile(path.join(__dirname, '../../dist', 'index.html'));
});

/* 7. Khởi động server */
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
