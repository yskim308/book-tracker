import express from "express";
import passport from "passport";
import "../auth/googleStrategy.ts";
export { router };

const router = express.Router();

router.get(
  "/",
  passport.authenticate("google", { scope: ["email", "profile"] }),
);

router.get(
  "/callback",
  passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: "/failure",
  }),
);

router.get("/failure", (req: express.Request, res: express.Response) => {
  res.status(401).send("auth failure");
});
