/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `Bookshelf` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Bookshelf_name_userId_key" ON "Bookshelf"("name", "userId");
