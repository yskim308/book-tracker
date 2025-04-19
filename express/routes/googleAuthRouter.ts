import express from "express";
import passport from "passport";
import "../auth/googleStrategy.ts";
import isAuthenticated from "../middleware/ensureAuthenticated.ts";
import type { Profile } from "passport-google-oauth20";
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
  passport.authenticate("google", { scope: ["email", "profile", "openid"] }),
);

router.get(
  "/callback",
  passport.authenticate("google", {
    successRedirect: `${frontendBase}/home`,
    failureRedirect: `${frontendBase}/unauthorized`,
  }),
  (req: express.Request, res: express.Response) => {
    if (!req.user) {
      return res.redirect(`${frontendBase}/unauthorized`);
    }

    const googleProfile = req.user as Profile;

    const payload = {
      userId: googleProfile.id,
      userEmails: googleProfile.emails,
      userProfileUrl: googleProfile.profileUrl,
      userPhotos: googleProfile.photos,
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: "24h" });
    res.cookie("authToken", token);
    res.redirect(`${frontendBase}/home`);
  },
);

router.get("/failure", (req: express.Request, res: express.Response) => {
  res.status(401).send("auth failure");
});

router.get(
  "/protected",
  isAuthenticated,
  (req: express.Request, res: express.Response) => {
    res.status(200).send("accessed protected route from session");
  },
);
