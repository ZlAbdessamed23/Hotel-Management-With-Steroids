/*
  Warnings:

  - The values [gouvernement,entretien_Menager] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('admin', 'receptionist', 'chef', 'nettoyeur', 'restaurent_Manager', 'reception_Manager', 'stock_Manager', 'entraineur', 'gouvernante');
ALTER TABLE "Admin" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "Admin" ALTER COLUMN "role" TYPE "UserRole_new"[] USING ("role"::text::"UserRole_new"[]);
ALTER TABLE "Employee" ALTER COLUMN "role" TYPE "UserRole_new"[] USING ("role"::text::"UserRole_new"[]);
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "Admin" ALTER COLUMN "role" SET DEFAULT ARRAY['admin']::"UserRole"[];
COMMIT;
