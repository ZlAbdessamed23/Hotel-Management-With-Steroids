/*
  Warnings:

  - You are about to drop the `LostObjects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "LostObjects";

-- CreateTable
CREATE TABLE "LostObject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "Location" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LostObject_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LostObject" ADD CONSTRAINT "LostObject_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
