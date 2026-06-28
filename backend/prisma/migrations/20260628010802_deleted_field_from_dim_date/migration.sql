/*
  Warnings:

  - You are about to drop the column `is_festive` on the `dim_date` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "gold"."dim_date" DROP COLUMN "is_festive";
