/*
  Warnings:

  - You are about to drop the column `emails` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `photos` on the `User` table. All the data in the column will be lost.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `picture` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "emails",
DROP COLUMN "photos",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "picture" TEXT NOT NULL;
