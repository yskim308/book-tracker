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

router.get(
  "/getUser",
  verifyJwt,
  async (req: express.Request, res: express.Response) => {
    const prisma = new PrismaClient();
    const userId = res.locals.userId;
    if (!userId) {
      throw new Error("user id is undefined from verifyjwt middleware");
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        picture: true,
      },
    });
    console.log("from /getUser: ");
    console.log(user);
    res.status(201).json({
      id: user?.id,
      name: user?.name,
      picture: user?.picture,
    });
  },
);

router.post("/logout", (req: express.Request, res: express.Response) => {
  res.clearCookie("authToken");
  res.status(200).send("logged out succesfully");
});
