import express from "express";
import { PrismaClient } from "../generated/prisma";
import verifyJwt from "../middleware/authenticateJwt";
export { router };

const router = express.Router();
const prisma = new PrismaClient();

// get all books in a bookshelf
router.get(
  "/bookshelves/:bookshelfName",
  verifyJwt,
  async (req: express.Request, res: express.Response) => {
    try {
      const userId = res.locals.userId;
      const bookshelfName = req.params.bookshelfName;

      if (!bookshelfName) {
        res.status(400).json({ error: "Bookshelf name is required" });
        return;
      }

      // Verify bookshelf belongs to user
      const bookshelf = await prisma.bookshelf.findFirst({
        where: {
          name: bookshelfName,
          userId: userId,
        },
      });

      if (!bookshelf) {
        res.status(404).json({ error: "Bookshelf not found or access denied" });
        return;
      }

      const books = await prisma.bookshelfBook.findMany({
        where: {
          bookshelfId: bookshelf.id,
        },
        include: {
          book: true,
        },
        orderBy: {
          addedAt: "desc",
        },
      });

      res.json({
        bookshelf: {
          id: bookshelf.id,
          name: bookshelf.name,
          description: bookshelf.description,
        },
        books: books.map((item) => ({
          ...item.book,
          addedAt: item.addedAt,
        })),
      });
    } catch (error) {
      console.error("Error fetching bookshelf books:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);
