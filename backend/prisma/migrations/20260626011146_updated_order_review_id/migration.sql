/*
  Warnings:

  - The primary key for the `orderReviews` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "raw"."orderReviews" DROP CONSTRAINT "orderReviews_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "review_id" DROP NOT NULL,
ADD CONSTRAINT "orderReviews_pkey" PRIMARY KEY ("id");
