/*
  Warnings:

  - You are about to drop the column `shipping_limit_date` on the `dim_order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "gold"."dim_order" DROP COLUMN "shipping_limit_date";
