// src/middleware/authenticate.js   (ESM version)

import jwt from 'jsonwebtoken';          // ← replace require
// import dotenv from 'dotenv';
// dotenv.config();                          // if you need env vars

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized access' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] }, (err, user) => {
    if (err) {
      console.error('JWT verify failed:', err.message);
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'TokenExpired' });
      }
      // invalid khác → 403
      return res.status(403).json({ error: 'InvalidToken' });
    }
    req.user = user;
    next();
  });
}

export default authenticate;         
