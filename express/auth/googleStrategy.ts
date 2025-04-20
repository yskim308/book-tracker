import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import type { Profile } from "passport-google-oauth20";
import { PrismaClient } from "../generated/prisma";
import type { User } from "../generated/prisma";

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
      // todo create user with prisma client
      return done(null, profile);
    },
  ),
);
