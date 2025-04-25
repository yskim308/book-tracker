import express from "express";
import verifyJwt from "../middleware/authenticateJwt";
import { PrismaClient } from "../generated/prisma";
export { router };

const router = express.Router();

router.get(
  "/",
  verifyJwt,
  async (req: express.Request, res: express.Response) => {
    const prisma = new PrismaClient();
    const userId = res.locals.userId;
    const user = prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    console.log("user from protected route: " + user);
    res.status(201).json({ message: "sup" });
    return;
  },
);
