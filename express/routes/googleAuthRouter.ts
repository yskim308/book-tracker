import express from "express";
import passport from "passport";
import "../auth/googleStrategy.ts";
import isAuthenticated from "../middleware/ensureAuthenticated.ts";
export { router };

const router = express.Router();
const frontendBase = process.env.FRONTEND_BASE;
if (!frontendBase) {
  throw new Error("frontend base url not configured properly");
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
