const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const authService = require('../../application/services/auth.service');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const user = await authService.findOrCreateGoogleUser(profile);
        // Return user data needed for token generation
        done(null, {
          id: user.id,
          email: user.email,
          role: user.role,
        });
      } catch (err) {
        done(err);
      }
    }
  )
);

module.exports = passport;
