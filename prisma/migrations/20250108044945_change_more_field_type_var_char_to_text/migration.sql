/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Card` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Card" ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "grade" SET DATA TYPE TEXT,
ALTER COLUMN "genre" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "nickName" SET DATA TYPE TEXT,
ALTER COLUMN "password" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Card_id_key" ON "Card"("id");
