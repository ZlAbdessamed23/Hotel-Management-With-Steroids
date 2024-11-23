/*
  Warnings:

  - You are about to drop the column `stockType` on the `Budget` table. All the data in the column will be lost.
  - Added the required column `stockId` to the `Budget` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Budget" DROP COLUMN "stockType",
ADD COLUMN     "stockId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "StockType";

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE CASCADE ON UPDATE CASCADE;
