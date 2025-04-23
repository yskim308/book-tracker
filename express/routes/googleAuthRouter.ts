import express from "express";
import passport, { session } from "passport";
import "../auth/googleStrategy.ts";
import type { User } from "../generated/prisma/index";
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
  (req: express.Request, res: express.Response) => {
    if (!req.user) {
      return res.redirect(`${frontendBase}/unauthorized`);
    }

    const googleProfile = req.user as User;

    //todo set the payload s the user object defined by prisma
    const payload = {
      userId: googleProfile.id,
      userEmails: googleProfile.email,
      userPicture: googleProfile.picture,
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: "24h" });
    // tood: set the options for the cookie
    res.cookie("authToken", token);
    res.redirect(`${frontendBase}/home`);
  },
);

router.get("/failure", (req: express.Request, res: express.Response) => {
  res.status(401).send("auth failure");
});
