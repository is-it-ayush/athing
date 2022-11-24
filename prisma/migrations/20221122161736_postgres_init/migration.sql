/*
  Warnings:

  - Made the column `avatarId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "styling" INT4 NOT NULL DEFAULT 0;
ALTER TABLE "User" ALTER COLUMN "avatarId" SET NOT NULL;
