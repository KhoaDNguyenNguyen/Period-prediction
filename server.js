// server.js (ES Modules)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { neon } from '@neondatabase/serverless';
import passport from 'passport';
import './passport.js';
import authRoutes from './authRoutes.js';
import path from 'path';

dotenv.config();

// 1) Env check
if (!process.env.DATABASE_URL) throw new Error('Missing DATABASE_URL');
if (!process.env.JWT_SECRET)    throw new Error('Missing JWT_SECRET');

// 2) Khởi tạo Neon client
const sql = neon(process.env.DATABASE_URL);

// 3) Tạo app và middleware chung
const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// 4) CORS từ ENV
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
app.use(cors({ origin: allowedOrigins }));

// 5) Passport OAuth
app.use(passport.initialize());
app.use('/auth', authRoutes);

// --- API routes ---

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Register
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
  }
  try {
    const hash = await bcrypt.hash(password, 12);
    await sql`
      INSERT INTO users (username, email, password_hash)
      VALUES (${username}, ${email}, ${hash})
    `;
    res.json({ ok: true });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Username hoặc email đã tồn tại' });
    }
    console.error(err);
    res.status(500).json({ error: 'Đăng ký thất bại' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
  }
  try {
    const [user] = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (!user) {
      return res.status(401).json({ error: 'Sai email hoặc mật khẩu' });
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Sai email hoặc mật khẩu' });
    }
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ ok: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Đăng nhập thất bại' });
  }
});

// JWT middleware
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization?.split(' ');
  if (authHeader?.[0] !== 'Bearer' || !authHeader[1]) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    req.user = jwt.verify(authHeader[1], process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Token không hợp lệ' });
  }
}

// Survey POST (protected)
app.post('/api/survey', authenticate, async (req, res) => {
  try {
    await sql`
      INSERT INTO survey_responses (payload, user_id)
      VALUES (
        ${JSON.stringify(req.body)}::jsonb,
        ${req.user.userId}
      )
    `;
    res.json({ ok: true });
  } catch (err) {
    console.error('DB insert failed:', err);
    res.status(500).json({ error: 'DB insert thất bại' });
  }
});

// --- Serve frontend ---

// Xác định __dirname
const __dirname = path.resolve();

// Serve tất cả file tĩnh trong public (bao gồm index.html và survey.html)
app.use(express.static(path.join(__dirname, 'public')));

// GET / → trả về login page (public/index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// GET /survey → trả về survey page (public/survey.html), chỉ khi đã auth
app.get('/survey', authenticate, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'survey.html'));
});

// Catch-all: route nào không match API hoặc /survey thì trả về login
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 8) Khởi động server
const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`)
);
