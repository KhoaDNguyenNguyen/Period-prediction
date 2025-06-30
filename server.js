// server.js (ES Modules)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import { neon } from '@neondatabase/serverless';
import passport from 'passport';
import './passport.js';               // cấu hình passport chiến lược local/JWT
import authRoutes from './authRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Xác định __dirname khi dùng ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1) Khởi tạo Express app
const app = express();

// 2) Middleware chung
app.use(express.json({ limit: '1mb' }));
app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true,
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 100,                 // tối đa 100 request
  })
);
app.use(passport.initialize());

// 3) Cấu hình Neon/Postgres (tự động lấy DATABASE_URL từ env)
const db = neon();

// 4) Các route liên quan đến đăng ký/đăng nhập
app.use('/auth', authRoutes);

// 5) Middleware xác thực JWT
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token không được cung cấp' });
  }
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Token không hợp lệ' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token không hợp lệ' });
    }
    req.user = decoded; // gắn thông tin user đã giải mã vào req
    next();
  });
}

// 6) API POST lưu survey (bảo vệ bằng JWT)
app.post('/api/survey', authenticate, async (req, res) => {
  const { payload } = req.body;
  try {
    await db.sql`
      INSERT INTO survey_responses (payload, user_id)
      VALUES (${payload}, ${req.user.id})
    `;
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB insert thất bại' });
  }
});

// 7) Serve frontend

// 7.1) Bảo vệ truy cập vào survey page (HTML) — chỉ khi đã auth
app.get(['/survey', '/survey.html'], authenticate, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'survey.html'));
});

// 7.2) Serve các file tĩnh (CSS, JS, images…) trong `public`
app.use(express.static(path.join(__dirname, 'public')));

// 7.3) Trang login mặc định (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 7.4) Catch-all: mọi route khác trả về login page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 8) Khởi động server
const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`)
);
