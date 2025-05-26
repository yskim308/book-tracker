import express from "express";
import { PrismaClient } from "@/generated/prisma";
import verifyJwt from "@/middleware/authenticateJwt";

const router = express.Router();
const prisma = new PrismaClient();

// Add book to bookshelf
router.post(
  "/bookshelves/:bookshelfName",
  verifyJwt,
  async (req: express.Request, res: express.Response) => {
    try {
      const userId = res.locals.userId;
      const bookshelfName = req.params.bookshelfName;
      const { externalId, status = "TO_READ" } = req.body;

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
        // Create new book with externalId
        book = await prisma.book.create({
          data: {
            userId: userId,
            externalId: externalId,
            status: status as "READ" | "READING" | "TO_READ",
          },
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
