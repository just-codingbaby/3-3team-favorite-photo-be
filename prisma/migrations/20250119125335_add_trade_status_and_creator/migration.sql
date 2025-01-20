/*
  Warnings:

  - Added the required column `creatorId` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TradeStatus" AS ENUM ('CREATED', 'SOLD', 'TRADED');

-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "creatorId" INTEGER NOT NULL,
ADD COLUMN     "tradeStatus" "TradeStatus" DEFAULT 'CREATED';

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
