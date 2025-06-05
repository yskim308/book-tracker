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

// create a bookshelf
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

// delete a bookshelf
interface DeleteShelfBody {
  bookshelfName: string;
}

router.delete(
  "/bookshelves/delete",
  verifyJwt,
  async (req: express.Request, res: express.Response) => {
    try {
      const userId = res.locals.userId;
      const { bookshelfName }: DeleteShelfBody = req.body;

      // First, find the bookshelf to ensure it exists and belongs to the user
      const bookshelf = await prisma.bookshelf.findFirst({
        where: {
          name: bookshelfName,
          userId: Number(userId),
        },
      });

      if (!bookshelf) {
        res.status(404).json({
          error: "Bookshelf not found or does not belong to user",
        });
        return;
      }

      // Use transaction to ensure consistency
      await prisma.$transaction(async (tx) => {
        // First, get all books that are ONLY in this bookshelf (will become orphaned)
        const orphanedBooks = await tx.book.findMany({
          where: {
            userId: Number(userId),
            bookshelves: {
              every: {
                bookshelfId: bookshelf.id,
              },
              some: {
                bookshelfId: bookshelf.id,
              },
            },
          },
          select: {
            id: true,
          },
        });

        const orphanedBookIds = orphanedBooks.map((book) => book.id);

        // Delete the bookshelf (this will cascade delete BookshelfBook entries)
        await tx.bookshelf.delete({
          where: {
            id: bookshelf.id,
          },
        });

        // Delete all orphaned books in a single query
        if (orphanedBookIds.length > 0) {
          await tx.book.deleteMany({
            where: {
              id: {
                in: orphanedBookIds,
              },
            },
          });
        }
      });

      res.json({
        message: "Bookshelf deleted successfully",
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);
