/*
  Warnings:

  - You are about to drop the column `stockId` on the `Budget` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Budget" DROP CONSTRAINT "Budget_stockId_fkey";

-- AlterTable
ALTER TABLE "Budget" DROP COLUMN "stockId";
