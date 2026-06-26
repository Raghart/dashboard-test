/*
  Warnings:

  - The primary key for the `orderPayments` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "raw"."orderPayments" DROP CONSTRAINT "orderPayments_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "order_id" DROP NOT NULL,
ADD CONSTRAINT "orderPayments_pkey" PRIMARY KEY ("id");
