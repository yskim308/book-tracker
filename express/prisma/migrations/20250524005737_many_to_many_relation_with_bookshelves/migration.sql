/*
  Warnings:

  - You are about to drop the column `link` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `review` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Book` table. All the data in the column will be lost.
  - Added the required column `externalId` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "link",
DROP COLUMN "review",
DROP COLUMN "title",
ADD COLUMN     "externalId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Bookshelf" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bookshelf_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookshelfBook" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "bookshelfId" INTEGER NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookshelfBook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Bookshelf_userId_idx" ON "Bookshelf"("userId");

-- CreateIndex
CREATE INDEX "BookshelfBook_bookId_idx" ON "BookshelfBook"("bookId");

-- CreateIndex
CREATE INDEX "BookshelfBook_bookshelfId_idx" ON "BookshelfBook"("bookshelfId");

-- CreateIndex
CREATE UNIQUE INDEX "BookshelfBook_bookId_bookshelfId_key" ON "BookshelfBook"("bookId", "bookshelfId");

-- CreateIndex
CREATE INDEX "Book_externalId_idx" ON "Book"("externalId");

-- AddForeignKey
ALTER TABLE "Bookshelf" ADD CONSTRAINT "Bookshelf_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookshelfBook" ADD CONSTRAINT "BookshelfBook_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookshelfBook" ADD CONSTRAINT "BookshelfBook_bookshelfId_fkey" FOREIGN KEY ("bookshelfId") REFERENCES "Bookshelf"("id") ON DELETE CASCADE ON UPDATE CASCADE;
