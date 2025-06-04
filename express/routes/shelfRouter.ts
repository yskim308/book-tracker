import express from "express";
import { PrismaClient } from "../generated/prisma";
import verifyJwt from "../middleware/authenticateJwt";
export { router };

const router = express.Router();
const prisma = new PrismaClient();

// get all bookshelves
router.get(
  "/bookshelves",
  verifyJwt,
  async (req: express.Request, res: express.Response) => {
    try {
      const userId = res.locals.userId;

      const bookshelves = await prisma.bookshelf.findMany({
        where: {
          userId: userId,
        },
        select: {
          name: true,
          _count: {
            select: {
              books: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      const bookshelvesWithCount = bookshelves.map((shelf) => {
        return {
          name: shelf.name,
          count: shelf._count.books,
        };
      });

      res.json({
        bookshelves: bookshelvesWithCount,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "internal server error" });
    }
  },
);

interface CreateBookShelfBody {
  bookshelfName: string;
  description: string;
}

router.post(
  "/bookshelves/create",
  verifyJwt,
  async (req: express.Request, res: express.Response) => {
    try {
      const userId = res.locals.userId;

      const { bookshelfName, description }: CreateBookShelfBody = req.body;

      await prisma.bookshelf.create({
        data: {
          userId: Number(userId),
          name: bookshelfName,
          description: description,
        },
      });
      res.json({
        message: "bookshelf created for user",
      });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  },
);
