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

const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: clientID,
      clientSecret: clientSecret,
      callbackURL: "http://localhost:4000/auth/google/callback",
    },
    async function (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done,
    ) {
      // todo create user with prisma client
      const id: string = profile.id;

      const name: string = profile._json.name ?? "";
      const email: string = profile._json.email ?? "";
      const picture: string = profile._json.picture ?? "";

      const user = await prisma.user.upsert({
        where: {
          googleId: id,
        },
        update: {
          name: name,
          email: email,
          picture: picture,
        },
        create: {
          googleId: id,
          name: name,
          email: email,
          picture: picture,
        },
      });
      return done(null, user);
    },
  ),
);
