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
    console.log("user id from res.locals: " + userId);
    if (!userId) {
      throw new Error("userId is undefined from verifyjwt middleware");
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    res.status(201).json({ data: user });
    return;
  },
);
