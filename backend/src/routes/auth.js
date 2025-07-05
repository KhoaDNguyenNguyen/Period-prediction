import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { registerUser, loginUser } from '../controllers/authController.js';
import passport from '../config/passport.js';
import { sql } from '../db.js';
import { CLIENT_URL } from '../config/constants.js';

const router = express.Router();

// User registration and login
router.post('/register', registerUser);
router.post('/login', loginUser);

// Google OAuth
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'],prompt: 'select_account', session: false })
);
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  async (req, res) => {
    try {
      const { id: providerId, displayName, emails } = req.user;
      const email = emails?.[0]?.value;
      if (!email) throw new Error('No email from provider');
      let [local] = await sql`SELECT id, username FROM users WHERE email = ${email}`;
      if (!local) {
        const username = displayName || `user_${providerId}`;
        const randomPass = bcrypt.hashSync(Date.now().toString(), 10);
        [local] = await sql`
          INSERT INTO users (username, email, password_hash)
          VALUES (${username}, ${email}, ${randomPass})
          RETURNING id, username
        `;
      }

      // Generate JWT with local user.id
      const payload = { userId: local.id, username: local.username };
      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Redirect to client with token in query
      const redirectURL = `${CLIENT_URL}/survey.html?token=${token}`;
      res.redirect(redirectURL);
    } catch (err) {
      console.error('OAuth callback error:', err);
      res.status(500).send('Authentication error');
    }
  }
);

// Facebook OAuth
router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['public_profile', 'email'], session: false })
);
router.get(
  '/facebook/callback',
  passport.authenticate('facebook',  { session: false }),
  async (req, res) => {
    try {
      const { id: providerId, displayName, emails } = req.user;
      const email = emails?.[0]?.value;
      if (!email) throw new Error('No email from provider');

      let [local] = await sql`SELECT id, username FROM users WHERE email = ${email}`;
      if (!local) {
        const username = displayName || `user_${providerId}`;
        const randomPass = bcrypt.hashSync(Date.now().toString(), 10);
        [local] = await sql`
          INSERT INTO users (username, email, password_hash)
          VALUES (${username}, ${email}, ${randomPass})
          RETURNING id, username
        `;
      }

      const payload = { userId: local.id, username: local.username };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
      res.redirect(`${CLIENT_URL}/survey.html?token=${token}`);
    } catch (err) {
      console.error('OAuth callback error:', err);
      res.status(500).send('Authentication error');
    }
  }
);

// GitHub OAuth
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'], session: false })
);
router.get(
  '/github/callback',
  passport.authenticate('github', { session: false }),
  async (req, res) => {
    try {
      const { id: providerId, username: ghUsername, emails } = req.user;
      const email = emails?.[0]?.value;
      if (!email) throw new Error('No email from provider');

      let [local] = await sql`SELECT id, username FROM users WHERE email = ${email}`;
      if (!local) {
        const username = ghUsername || `user_${providerId}`;
        const randomPass = bcrypt.hashSync(Date.now().toString(), 10);
        [local] = await sql`
          INSERT INTO users (username, email, password_hash)
          VALUES (${username}, ${email}, ${randomPass})
          RETURNING id, username
        `;
      }

      const payload = { userId: local.id, username: local.username };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
      res.redirect(`${CLIENT_URL}/survey.html?token=${token}`);
    } catch (err) {
      console.error('OAuth callback error:', err);
      res.status(500).send('Authentication error');
    }
  }
);

// LinkedIn OAuth
router.get(
  '/linkedin',
  passport.authenticate('linkedin', { scope: ['r_liteprofile', 'r_emailaddress'], session: false })
);
router.get(
  '/linkedin/callback',
  passport.authenticate('linkedin', { session: false }),
  async (req, res) => {
    try {
      const { id: providerId, displayName, emails } = req.user;
      const email = emails?.[0]?.value;
      if (!email) throw new Error('No email from provider');

      let [local] = await sql`SELECT id, username FROM users WHERE email = ${email}`;
      if (!local) {
        const username = displayName || `user_${providerId}`;
        const randomPass = bcrypt.hashSync(Date.now().toString(), 10);
        [local] = await sql`
          INSERT INTO users (username, email, password_hash)
          VALUES (${username}, ${email}, ${randomPass})
          RETURNING id, username
        `;
      }

      const payload = { userId: local.id, username: local.username };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
      res.redirect(`${CLIENT_URL}/survey.html?token=${token}`);
    } catch (err) {
      console.error('OAuth callback error:', err);
      res.status(500).send('Authentication error');
    }
  }
);

export default router;
