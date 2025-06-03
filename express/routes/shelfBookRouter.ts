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

// Add book to bookshelf
//
interface BookCreationBody {
  externalId: string;
  status?: "READ" | "TO_READ" | "READING";
  title: string;
  authors: string[];
}
router.post(
  "/bookshelves/:bookshelfName",
  verifyJwt,
  async (req: express.Request, res: express.Response) => {
    try {
      const userId = res.locals.userId;
      const bookshelfName = req.params.bookshelfName;
      const { externalId, status, title, authors }: BookCreationBody = req.body;

      if (!bookshelfName) {
        res.status(400).json({ error: "Bookshelf name is required" });
        return;
      }

      if (!externalId) {
        res.status(400).json({ error: "externalId is required" });
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

      // Find existing book by externalId for this user, or create new one
      let book = await prisma.book.findFirst({
        where: {
          externalId: externalId,
          userId: userId,
        },
      });

      let bookCreated = false;
      if (!book) {
        if (!status) {
          res
            .status(400)
            .json({ error: "status is required when creating a book" });
        }
        const bookData: any = {
          userId: userId,
          externalId: externalId,
          status: status as "READ" | "READING" | "TO_READ",
          title: title,
          author: authors,
        };

        // if status is read, put in the completion date
        if (status === "READ") {
          bookData.completionDate = new Date();
        }
        // Create new book with externalId
        book = await prisma.book.create({
          data: bookData,
        });
        bookCreated = true;
      }

      // Check if book is already in bookshelf
      const existingEntry = await prisma.bookshelfBook.findUnique({
        where: {
          bookId_bookshelfId: {
            bookId: book.id,
            bookshelfId: bookshelf.id,
          },
        },
      });

      if (existingEntry) {
        res.status(409).json({ error: "Book is already in this bookshelf" });
      }

      // Add book to bookshelf
      const bookshelfBook = await prisma.bookshelfBook.create({
        data: {
          bookId: book.id,
          bookshelfId: bookshelf.id,
        },
        include: {
          book: true,
          bookshelf: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      res.status(201).json({
        message: `Book ${bookCreated ? "created and " : ""}added to bookshelf successfully`,
        data: bookshelfBook,
        bookCreated: bookCreated,
      });
    } catch (error) {
      console.error("Error adding book to bookshelf:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Delete a book from a bookshelf
router.delete(
  "/bookshelves/:bookshelfName",
  verifyJwt,
  async (req: express.Request, res: express.Response) => {
    try {
      const userId = res.locals.userId;
      const bookshelfName = req.params.bookshelfName;
      const { externalId } = req.body;

      if (!bookshelfName) {
        res.status(400).json({ error: "Bookshelf name is required" });
        return;
      }
      if (!externalId) {
        res.status(400).json({ error: "External ID is required" });
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

      // Find book by externalId for this user
      const book = await prisma.book.findFirst({
        where: {
          externalId: externalId,
          userId: userId,
        },
      });

      if (!book) {
        res.status(404).json({ error: "Book not found in your library" });
        return;
      }

      // Find and delete the bookshelf-book relationship
      const bookshelfBook = await prisma.bookshelfBook.findUnique({
        where: {
          bookId_bookshelfId: {
            bookId: book.id,
            bookshelfId: bookshelf.id,
          },
        },
      });

      if (!bookshelfBook) {
        res.status(404).json({ error: "Book is not in this bookshelf" });
        return;
      }

      // Use transaction to ensure consistency
      await prisma.$transaction(async (tx) => {
        // Delete the bookshelf-book relationship
        await tx.bookshelfBook.delete({
          where: {
            id: bookshelfBook.id,
          },
        });

        // Check if book is still in any other bookshelves
        const remainingBookshelfBooks = await tx.bookshelfBook.findMany({
          where: {
            bookId: book.id,
          },
        });

        // If book is not in any other bookshelves, delete the book entirely
        if (remainingBookshelfBooks.length === 0) {
          await tx.book.delete({
            where: {
              id: book.id,
            },
          });
        }
      });

      res.json({
        message: "Book removed from bookshelf successfully",
      });
    } catch (error) {
      console.error("Error removing book from bookshelf:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);
