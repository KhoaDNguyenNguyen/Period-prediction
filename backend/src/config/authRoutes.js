import express from 'express';
import passport from './passport.js';
import jwt from 'jsonwebtoken';


const router = express.Router();

/* -------------------------------------------------------------------------- */
/*  Function to issue a JWT and redirect to the frontend.”                    */
/* -------------------------------------------------------------------------- */
function issueJWT(user, res) {
  const payload = {
    userId: parseInt(user.id, 10),
    username: user.displayName || user.username,
    provider: user.provider,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });

  const redirectURL = `${process.env.FRONTEND_URL || ''}/survey.html?token=${token}`;

  return res.redirect(redirectURL);
}

/* -------------------------------------------------------------------------- */
/*  GOOGLE OAUTH                                                                  */
/* -------------------------------------------------------------------------- */
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,

    failureRedirect: '/index.html',
  }),
  (req, res) => issueJWT(req.user, res)
);

/* -------------------------------------------------------------------------- */
/*  FACEBOOK OAUTH                                                              */
/* -------------------------------------------------------------------------- */
router.get('/facebook', passport.authenticate('facebook', {scope: ['email']}));

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    session: false,
    failureRedirect: '/index.html',
  }),
  (req, res) => issueJWT(req.user, res)
);

/* -------------------------------------------------------------------------- */
/*  GITHUB OAUTH                                                               */
/* -------------------------------------------------------------------------- */
router.get('/github', passport.authenticate('github', {scope: ['user:email']}));

router.get(
  '/github/callback',
  passport.authenticate('github', {
    session: false,
    failureRedirect: '/index.html',
  }),
  (req, res) => issueJWT(req.user, res)
);

/* -------------------------------------------------------------------------- */
/*  LINKEDIN OAUTH                                                             */
/* -------------------------------------------------------------------------- */
router.get(
  '/linkedin',
  passport.authenticate('linkedin', {
    scope: ['r_liteprofile', 'r_emailaddress'],
  })
);

router.get(
  '/linkedin/callback',
  passport.authenticate('linkedin', {
    session: false,
    failureRedirect: '/index.html',
  }),
  (req, res) => issueJWT(req.user, res)
);

/* -------------------------------------------------------------------------- */
/*  SIGNOUT                                                   */
/* -------------------------------------------------------------------------- */
router.get('/logout', (req, res) => {
  req.logout?.(() => {});
  res.redirect('/');
});

export default router;
