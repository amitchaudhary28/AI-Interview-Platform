/*
  Warnings:

  - You are about to drop the column `avatar` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatar",
ADD COLUMN     "avgScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "badge" TEXT NOT NULL DEFAULT 'Beginner',
ADD COLUMN     "lastActiveDate" TIMESTAMP(3),
ADD COLUMN     "totalSessions" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "totalScore" SET DEFAULT 0,
ALTER COLUMN "totalScore" SET DATA TYPE DOUBLE PRECISION;
