import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import type { DoneCallback } from "passport";

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
if (!clientID || !clientSecret) {
  throw new Error("invalid or empty google client id or secret");
}

passport.use(
  new GoogleStrategy(
    {
      clientID: clientID,
      clientSecret: clientSecret,
      callbackURL: "http://localhost:4000/auth/google/callback",
    },
    function (
      accessToken: string,
      refreshToken: string,
      profile: Express.User,
      done,
    ) {
      return done(null, profile);
    },
  ),
);

passport.serializeUser((user: Express.User, done: DoneCallback) => {
  return done(null, user);
});

passport.deserializeUser((user: Express.User, done: DoneCallback) => {
  return done(null, user);
});
