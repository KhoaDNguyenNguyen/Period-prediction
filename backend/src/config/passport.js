import passport from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import {Strategy as FacebookStrategy} from 'passport-facebook';
import {Strategy as AppleStrategy} from 'passport-apple';
import MagicLoginStrategy from 'passport-magic-login';

const callback = (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
    },
    callback
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/facebook/callback`,
      profileFields: ['id', 'displayName', 'emails'],
    },
    callback
  )
);

passport.use(
  new AppleStrategy(
    {
      clientID: process.env.APPLE_CLIENT_ID,
      teamID: process.env.APPLE_TEAM_ID,
      keyID: process.env.APPLE_KEY_ID,
      callbackURL: `${process.env.BACKEND_URL}/auth/apple/callback`,
      privateKeyString: process.env.APPLE_PRIVATE_KEY,
    },
    callback
  )
);

passport.use(
  new MagicLoginStrategy({
    secret: process.env.MAGIC_SECRET,
    callbackUrl: `${process.env.BACKEND_URL}/auth/magic/callback`,
    verify: (payload, done) => done(null, {id: payload.destination, emails: [{value: payload.destination}]}),
    sendMagicLink: async (dest, href) => {
      console.log('Magic link for', dest, href);
    },
  })
);

export default passport;
