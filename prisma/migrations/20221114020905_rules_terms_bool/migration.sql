-- AlterTable
ALTER TABLE "User" ADD COLUMN     "acceptedRules" BOOL NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN     "acceptedTerms" BOOL NOT NULL DEFAULT false;
