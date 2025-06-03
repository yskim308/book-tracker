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
        console.log("book: " + externalId + " does not exist");
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
