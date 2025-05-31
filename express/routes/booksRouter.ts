import express from "express";
import { PrismaClient } from "../generated/prisma";
import verifyJwt from "../middleware/authenticateJwt";
export { router };

const router = express.Router();
const prisma = new PrismaClient();

// check if book exists in library
router.get(
  "/books/check/:externalId",
  verifyJwt,
  async (req: express.Request, res: express.Response) => {
    try {
      const userId = res.locals.userId;
      const externalId = req.params.externalId;

      if (!externalId) {
        res.status(400).json({ error: "External ID is required" });
        return;
      }

      const book = await prisma.book.findFirst({
        where: {
          externalId: externalId,
          userId: userId,
        },
        include: {
          bookshelves: {
            include: {
              bookshelf: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      if (book) {
        res.json({
          exists: true,
          book: {
            id: book.id,
            externalId: book.externalId,
            title: book.title,
            author: book.author,
            status: book.status,
            completionDate: book.completionDate,
            bookshelves: book.bookshelves.map((bb) => bb.bookshelf.name),
          },
        });
      } else {
        res.json({
          exists: false,
        });
      }
    } catch (error) {
      console.error("Error checking book existence:", error);
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

//delete a book from a bookshelf
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

      await prisma.bookshelfBook.delete({
        where: {
          id: bookshelfBook.id,
        },
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

// update the status of a book
interface BookStatusUpdateBody {
  externalId: string;
  status: "READ" | "TO_READ" | "READING";
}
router.patch(
  "/books/status",
  verifyJwt,
  async (req: express.Request, res: express.Response) => {
    try {
      const userId = res.locals.userId;
      const { externalId, status }: BookStatusUpdateBody = req.body;

      if (!externalId) {
        res.status(400).json({ error: "External ID is required" });
        return;
      }

      if (!status || !["READ", "TO_READ", "READING"].includes(status)) {
        res
          .status(400)
          .json({ error: "Valid status is required (READ, TO_READ, READING)" });
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

      // Prepare update data
      const updateData: any = {
        status: status as "READ" | "READING" | "TO_READ",
      };

      // Set completion date if status is READ
      if (status === "READ") {
        updateData.completionDate = new Date();
      } else if (status === "TO_READ" || status === "READING") {
        // Clear completion date if changing from READ to another status
        updateData.completionDate = null;
      }

      const updatedBook = await prisma.book.update({
        where: {
          id: book.id,
        },
        data: updateData,
      });

      res.json({
        message: "Book status updated successfully",
        data: updatedBook,
      });
    } catch (error) {
      console.error("Error updating book status:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);
