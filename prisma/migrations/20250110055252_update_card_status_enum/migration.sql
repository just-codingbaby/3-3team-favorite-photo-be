/*
  Warnings:

  - The values [SPORTS] on the enum `Genre` will be removed. If these variants are still used in the database, this will fail.
  - The values [NORMAL] on the enum `Grade` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "CardStatus" AS ENUM ('AVAILABLE', 'SOLD_OUT', 'IN_TRADE');

-- AlterEnum
BEGIN;
CREATE TYPE "Genre_new" AS ENUM ('TRAVEL', 'LANDSCAPE', 'PORTRAIT', 'OBJECT');
ALTER TABLE "Card"
  ALTER COLUMN "genre" TYPE "Genre_new" USING ("genre"::text::"Genre_new");
ALTER TYPE "Genre" RENAME TO "Genre_old";
ALTER TYPE "Genre_new" RENAME TO "Genre";
DROP TYPE "Genre_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Grade_new" AS ENUM ('COMMON', 'RARE', 'SUPER_RARE', 'LEGENDARY');
ALTER TABLE "Card"
  ALTER COLUMN "grade" TYPE "Grade_new" USING ("grade"::text::"Grade_new");
ALTER TYPE "Grade" RENAME TO "Grade_old";
ALTER TYPE "Grade_new" RENAME TO "Grade";
DROP TYPE "Grade_old";
COMMIT;

-- AlterTable
ALTER TABLE "Card"
  ADD COLUMN "status" "CardStatus" DEFAULT 'AVAILABLE';