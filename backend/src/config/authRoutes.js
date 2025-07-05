// authRoutes.js
import express from 'express';
// import dotenv from 'dotenv';
import passport from './passport.js';
import jwt from 'jsonwebtoken';

// dotenv.config();

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*  HÀM PHÁT HÀNH JWT & REDIRECT VỀ FRONTEND                                  */
/* -------------------------------------------------------------------------- */
function issueJWT(user, res) {
  const payload = {
    userId: parseInt(user.id, 10),   // ép kiểu sang integer
    username: user.displayName || user.username,
    provider: user.provider
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });

  const redirectURL = `${process.env.FRONTEND_URL || ''}/survey.html?token=${token}`;

  return res.redirect(redirectURL);
}

/* -------------------------------------------------------------------------- */
/*  GOOGLE                                                                    */
/* -------------------------------------------------------------------------- */
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    
    failureRedirect: '/index.html'      // hoặc trang login
  }),
  (req, res) => issueJWT(req.user, res)
);

/* -------------------------------------------------------------------------- */
/*  FACEBOOK                                                                  */
/* -------------------------------------------------------------------------- */
router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    session: false,
    failureRedirect: '/index.html'
  }),
  (req, res) => issueJWT(req.user, res)
);

/* -------------------------------------------------------------------------- */
/*  GITHUB                                                                    */
/* -------------------------------------------------------------------------- */
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get(
  '/github/callback',
  passport.authenticate('github', {
    session: false,
    failureRedirect: '/index.html'
  }),
  (req, res) => issueJWT(req.user, res)
);

/* -------------------------------------------------------------------------- */
/*  LINKEDIN                                                                  */
/* -------------------------------------------------------------------------- */
router.get(
  '/linkedin',
  passport.authenticate('linkedin', {
    scope: ['r_liteprofile', 'r_emailaddress']
  })
);

router.get(
  '/linkedin/callback',
  passport.authenticate('linkedin', {
    session: false,
    failureRedirect: '/index.html'
  }),
  (req, res) => issueJWT(req.user, res)
);

/* -------------------------------------------------------------------------- */
/*  ĐĂNG XUẤT (tuỳ chọn)                                                      */
/* -------------------------------------------------------------------------- */
router.get('/logout', (req, res) => {
  // passport >=0.6 có req.logout bất đồng bộ
  req.logout?.(() => {});
  res.redirect('/');
});

export default router;
