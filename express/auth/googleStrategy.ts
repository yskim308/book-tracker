import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import type { Profile } from "passport-google-oauth20";

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
      profile: Profile,
      done,
    ) {
      console.log(profile);
      // todo: integrate with database users table
      // note that it should be an async function
      return done(null, profile);
    },
  ),
);
