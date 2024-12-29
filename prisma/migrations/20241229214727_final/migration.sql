/*
  Warnings:

  - The values [organizatrice] on the enum `AttendueType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AttendueType_new" AS ENUM ('normale', 'organisateur', 'serveur');
ALTER TABLE "Attendue" ALTER COLUMN "type" TYPE "AttendueType_new" USING ("type"::text::"AttendueType_new");
ALTER TYPE "AttendueType" RENAME TO "AttendueType_old";
ALTER TYPE "AttendueType_new" RENAME TO "AttendueType";
DROP TYPE "AttendueType_old";
COMMIT;
