/*
  Warnings:

  - Added the required column `stockType` to the `Budget` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StockType" AS ENUM ('spa', 'restaurent', 'material');

-- AlterTable
ALTER TABLE "Budget" ADD COLUMN     "stockType" "StockType" NOT NULL;
