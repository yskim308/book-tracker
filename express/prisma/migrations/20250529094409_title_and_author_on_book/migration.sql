/*
  Warnings:

  - Added the required column `title` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "author" TEXT[],
ADD COLUMN     "title" TEXT NOT NULL;
