import express from "express";
import isAuthenticated from "../middleware/authenticateJwt";
import type { User } from "../generated/prisma";

const router = express.Router();
const frontendBase = process.env.FRONTEND_BASE;

router.get(
  "/home",
  isAuthenticated,
  (req: express.Request, res: express.Response) => {
    const user = res.locals.user as User;
    res.status(201).send(`${user}, welcome to protected route`);
    return;
  },
);
