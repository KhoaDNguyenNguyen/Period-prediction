// authRoutes.js
import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Hàm tạo JWT khi xác thực OAuth thành công
const issueJWT = (user, res) => {
  const payload = {
    oauthId: user.id,
    name: user.displayName,
    provider: user.provider
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Redirect về trang khảo sát kèm token
  res.redirect(`/survey.html?token=${token}`);
};

// ===== GOOGLE =====
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  // passport.authenticate('google', { session: false, failureRedirect: '/SignUp_LogIn_Form.html' }),
    passport.authenticate('google', { session: false, failureRedirect: '/index.html' }),
  (req, res) => issueJWT(req.user, res)
);

// ===== FACEBOOK =====
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback',
  // passport.authenticate('facebook', { session: false, failureRedirect: '/SignUp_LogIn_Form.html' }),
    passport.authenticate('facebook', { session: false, failureRedirect: '/index.html' }),
  (req, res) => issueJWT(req.user, res)
);

// ===== GITHUB =====
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback',
  // passport.authenticate('github', { session: false, failureRedirect: '/SignUp_LogIn_Form.html' }),
    passport.authenticate('github', { session: false, failureRedirect: '/index.html' }),
  (req, res) => issueJWT(req.user, res)
);

// ===== LINKEDIN =====
router.get('/linkedin', passport.authenticate('linkedin', { scope: ['r_liteprofile', 'r_emailaddress'] }));
router.get('/linkedin/callback',
  // passport.authenticate('linkedin', { session: false, failureRedirect: '/SignUp_LogIn_Form.html' }),
    passport.authenticate('linkedin', { session: false, failureRedirect: '/index.html' }),
  (req, res) => issueJWT(req.user, res)
);

export default router;
