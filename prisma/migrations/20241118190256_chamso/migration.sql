/*
  Warnings:

  - A unique constraint covering the columns `[stockId]` on the table `Budget` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Budget_stockId_key" ON "Budget"("stockId");
