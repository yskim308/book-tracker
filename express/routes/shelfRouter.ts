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

      // Validate request body
      if (!bookshelfName || bookshelfName.trim() === "") {
        res.status(400).json({ error: "Bookshelf name is required" });
        return;
      }

      // Check if a bookshelf with this name already exists for this user
      const existingBookshelf = await prisma.bookshelf.findFirst({
        where: {
          name: bookshelfName.trim(),
          userId: Number(userId),
        },
      });

      if (existingBookshelf) {
        res.status(409).json({
          error: "A bookshelf with this name already exists",
        });
        return;
      }

      await prisma.bookshelf.create({
        data: {
          userId: Number(userId),
          name: bookshelfName.trim(),
          description: description?.trim() || null,
        },
      });

      res.json({
        message: "bookshelf created for user",
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal server error" });
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

// update a bookshelf
// update a bookshelf
interface UpdateShelfBody {
  name: string;
  description: string;
}

router.put(
  "/bookshelves/update/:bookshelfName",
  verifyJwt,
  async (req: express.Request, res: express.Response) => {
    try {
      const userId = res.locals.userId;
      const currentBookshelfName = decodeURIComponent(req.params.bookshelfName);
      const { name, description }: UpdateShelfBody = req.body;

      // Validate bookshelf name from params
      if (!currentBookshelfName || currentBookshelfName.trim() === "") {
        res.status(400).json({ error: "Invalid bookshelf name in URL" });
        return;
      }

      // Validate request body
      if (!name || name.trim() === "") {
        res.status(400).json({ error: "Bookshelf name is required" });
        return;
      }

      // First, find the bookshelf to ensure it exists and belongs to the user
      const bookshelf = await prisma.bookshelf.findFirst({
        where: {
          name: currentBookshelfName,
          userId: Number(userId),
        },
      });

      if (!bookshelf) {
        res.status(404).json({
          error: "Bookshelf not found or does not belong to user",
        });
        return;
      }

      // Check if another bookshelf with the same name already exists for this user
      const existingBookshelf = await prisma.bookshelf.findFirst({
        where: {
          name: name.trim(),
          userId: Number(userId),
          NOT: {
            name: currentBookshelfName, // Exclude the current bookshelf from the check
          },
        },
      });

      if (existingBookshelf) {
        res.status(409).json({
          error: "A bookshelf with this name already exists",
        });
        return;
      }

      // Update the bookshelf
      const updatedBookshelf = await prisma.bookshelf.update({
        where: {
          id: bookshelf.id,
        },
        data: {
          name: name.trim(),
          description: description?.trim() || null,
        },
      });

      res.json({
        message: "Bookshelf updated successfully",
        bookshelf: {
          id: updatedBookshelf.id,
          name: updatedBookshelf.name,
          description: updatedBookshelf.description,
        },
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);
