import express from "express";
import passport, { session } from "passport";
import "../auth/googleStrategy.ts";
import type { User } from "../generated/prisma/index";
import { PrismaClient } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";
export { router };

const router = express.Router();
const frontendBase = process.env.FRONTEND_BASE;
const jwtSecret = process.env.JWT_SECRET;

if (!frontendBase) {
  throw new Error("frontend base url not configured properly");
}
if (!jwtSecret) {
  throw new Error("no jwt secret found");
}

router.get(
  "/",
  passport.authenticate("google", {
    scope: ["email", "profile", "openid"],
    session: false,
  }),
);

router.get(
  "/callback",
  passport.authenticate("google", { session: false }),
  async (req: express.Request, res: express.Response) => {
    if (!req.user) {
      return res.redirect(`${frontendBase}/unauthorized`);
    }

    const googleProfile = req.user as User;
    if (!googleProfile.googleId) {
      throw new Error("unable to find googleId");
    }
    console.log(
      "the google id where we will find from prisma: " + googleProfile.googleId,
    );

    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({
      where: {
        googleId: googleProfile.googleId,
      },
      select: {
        id: true,
      },
    });
    if (!user) {
      throw new Error("prisma query empty");
    }
    console.log("the id from prisma: " + user.id);

    const payload = {
      sub: user.id,
    };
    console.log("the payload to be sigend: " + payload.sub);

    const token = jwt.sign(payload, jwtSecret, { expiresIn: "24h" });
    // tood: set the options for the cookie
    res.cookie("authToken", token);
    res.redirect(`${frontendBase}/home`);
  },
);

router.get("/failure", (req: express.Request, res: express.Response) => {
  res.status(401).send("auth failure");
});
