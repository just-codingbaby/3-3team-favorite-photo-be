/*
  Warnings:

  - You are about to alter the column `name` on the `Card` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `nickName` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - Changed the type of `grade` on the `Card` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `genre` on the `Card` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Grade" AS ENUM ('RARE', 'NORMAL', 'EPIC', 'LEGENDARY');

-- CreateEnum
CREATE TYPE "Genre" AS ENUM ('ACTION', 'ADVENTURE', 'RPG', 'SPORTS', 'STRATEGY');

-- DropIndex
DROP INDEX "Card_id_key";

-- AlterTable
ALTER TABLE "Card" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
DROP COLUMN "grade",
ADD COLUMN     "grade" "Grade" NOT NULL,
DROP COLUMN "genre",
ADD COLUMN     "genre" "Genre" NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "nickName" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255);
