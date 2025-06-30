// server.js  (ES Modules)
// -------------------------------------------
import express from 'express';
import cors    from 'cors';
import dotenv  from 'dotenv';
import helmet  from 'helmet';
import rateLimit from 'express-rate-limit';
import bcrypt  from 'bcrypt';
import jwt     from 'jsonwebtoken';
import { neon } from '@neondatabase/serverless';
// import dotenv from 'dotenv';
dotenv.config(); 
import passport from 'passport';
import session from 'express-session';
import './passport.js';


import { fileURLToPath } from 'url';
import path from 'path';
// ... cuối file __dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);



// 1) .env
// dotenv.config();
if (!process.env.DATABASE_URL) throw new Error('Missing DATABASE_URL');
if (!process.env.JWT_SECRET)    throw new Error('Missing JWT_SECRET');

// 2) Neon SQL client
const sql = neon(process.env.DATABASE_URL);

// 3) App setup
const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Sau khi app = express();
// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Khi truy cập root, luôn trả về trang đăng nhập
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



// 4) CORS
const allowedOrigins = [
  'http://127.0.0.1:5500',
  'http://localhost:5500'
];
app.use(cors({ origin: allowedOrigins }));
app.use(passport.initialize());

import authRoutes from './authRoutes.js';
app.use('/auth', authRoutes);
// 5) Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// 6) Register
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

// 7) Login
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

// 8) JWT middleware
function authenticate(req, res, next) {
  const auth = req.headers.authorization?.split(' ');
  if (auth?.[0] !== 'Bearer' || !auth[1]) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const payload = jwt.verify(auth[1], process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Token không hợp lệ' });
  }
}

// 9) Survey (protected)
app.post('/api/survey', authenticate, async (req, res) => {
  try {
    await sql`
      INSERT INTO survey_responses (payload, user_id)
      VALUES (
        ${JSON.stringify(req.body)}::jsonb,
        ${req.user.userId}
      )
    `;
    return res.json({ ok: true });
  } catch (err) {
    console.error('DB insert failed:', err);
    return res.status(500).json({ error: 'DB insert failed' });
  }
});

// 10) Start server
const PORT = process.env.PORT ?? 3000;
const server = app.listen(PORT, () =>
  console.log(`API listening on http://localhost:${PORT}`)
);
['SIGINT','SIGTERM'].forEach(sig =>
  process.on(sig, () => { console.log('\n⏹  Closing server...'); server.close(() => process.exit(0)); })
);
