import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {sql} from '../db.js';

export const registerUser = async (req, res) => {
  try {
    const {username, email, password} = req.body;
    if (!username || !email || !password) return res.status(400).json({error: 'Thiếu thông tin'});

    const dup = await sql`SELECT 1 FROM users WHERE email = ${email}`;
    if (dup.length) return res.status(409).json({error: 'Email đã tồn tại'});

    const hash = await bcrypt.hash(password, 10);
    await sql`
      INSERT INTO users (username, email, password_hash)
      VALUES (${username}, ${email}, ${hash})
    `;

    res.status(201).json({message: 'Đăng ký thành công'});
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Lỗi server'});
  }
};

export const loginUser = async (req, res) => {
  try {
    const {email, password} = req.body;
    const rows = await sql`
      SELECT id, username, password_hash FROM users WHERE email = ${email}
    `;
    if (!rows.length) return res.status(401).json({error: 'Sai thông tin'});

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({error: 'Sai thông tin'});
    const payload = {userId: user.id, username: user.username};
    console.log('Signing JWT payload:', payload);
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.json({token});
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Lỗi server'});
  }
};
