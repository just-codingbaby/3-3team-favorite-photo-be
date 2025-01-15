/*
  Warnings:

  - The values [AVAILABLE,IN_TRADE] on the enum `CardStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CardStatus_new" AS ENUM ('CREATED', 'FOR_SALE', 'FOR_TRADING', 'SOLD_OUT', 'ON_TRADING');
ALTER TABLE "Card"
  ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Card"
  ALTER COLUMN "status" TYPE "CardStatus_new" USING ("status"::text::"CardStatus_new");
ALTER TYPE "CardStatus" RENAME TO "CardStatus_old";
ALTER TYPE "CardStatus_new" RENAME TO "CardStatus";
DROP TYPE "CardStatus_old";
ALTER TABLE "Card"
  ALTER COLUMN "status" SET DEFAULT 'CREATED';
COMMIT;

-- AlterTable
ALTER TABLE "Card"
  ALTER COLUMN "status" SET DEFAULT 'CREATED';