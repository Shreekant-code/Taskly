import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../Schema/userschema.js";
import dotenv from "dotenv";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        // Find by googleId OR email
        let user = await User.findOne({ $or: [{ googleId: profile.id }, { email }] });

        if (!user) {
          // New Google user
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: email,
          });
        } else if (!user.googleId) {
          // Existing user registered with email → link Google
          user.googleId = profile.id;
          await user.save();
        }

        done(null, user);
      } catch (err) {
        console.error("Google OAuth error:", err);
        done(err, null);
      }
    }
  )
);

export default passport;
