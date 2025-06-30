// server.js  (ES Modules)
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

// 1) Kiểm tra biến môi trường
if (!process.env.DATABASE_URL) throw new Error('Missing DATABASE_URL');
if (!process.env.JWT_SECRET)    throw new Error('Missing JWT_SECRET');

// 2) Khởi tạo Neon client
const sql = neon(process.env.DATABASE_URL);

// 3) Tạo app và middleware chung
const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// 4) CORS từ biến môi trường
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
app.use(cors({ origin: allowedOrigins }));

// 5) Passport OAuth
app.use(passport.initialize());
app.use('/auth', authRoutes);

// 6) API routes

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
    if (!user) return res.status(401).json({ error: 'Sai email hoặc mật khẩu' });
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Sai email hoặc mật khẩu' });

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
  const auth = req.headers.authorization?.split(' ');
  if (auth?.[0] !== 'Bearer' || !auth[1]) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    req.user = jwt.verify(auth[1], process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Token không hợp lệ' });
  }
}

// Survey (protected)
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
    res.status(500).json({ error: 'DB insert failed' });
  }
});

// 7) Serve frontend (static + routes)

// Đặt __dirname
const __dirname = path.resolve();

// Serve mọi asset tĩnh (CSS, JS, hình ảnh, fonts…)
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(
  path.join(__dirname, 'public'),
  { index: false }    // 🛑 Tắt mặc định index.html
));

// Khi user vào "/", trả về trang login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'SignUp_LogIn_Form.html'));
});

// Route cho survey
app.get(
  '/survey',
  authenticate,
  (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'survey.html'));
  }
);

// Catch-all cho SPA (nếu user vào các đường dẫn khác)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'SignUp_LogIn_Form.html'));
});

// 8) Khởi động server
const PORT = process.env.PORT ?? 3000;
const server = app.listen(PORT, () =>
  console.log(`API listening on http://localhost:${PORT}`)
);

// Bắt tín hiệu dừng để đóng server gọn gàng
['SIGINT', 'SIGTERM'].forEach(sig =>
  process.on(sig, () => {
    console.log('\n⏹  Closing server...');
    server.close(() => process.exit(0));
  })
);
