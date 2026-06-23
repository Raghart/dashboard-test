/*
  Warnings:

  - The primary key for the `categoryName` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `categoryName` table. All the data in the column will be lost.
  - Made the column `product_category_name` on table `categoryName` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "raw"."categoryName" DROP CONSTRAINT "categoryName_pkey",
DROP COLUMN "id",
ALTER COLUMN "product_category_name" SET NOT NULL,
ADD CONSTRAINT "categoryName_pkey" PRIMARY KEY ("product_category_name");

-- CreateTable
CREATE TABLE "raw"."product" (
    "product_id" TEXT NOT NULL,
    "product_category_name" TEXT,
    "product_name_lenght" INTEGER,
    "product_description_lenght" INTEGER,
    "product_photos_qty" INTEGER,
    "product_weight_g" INTEGER,
    "product_length_cm" INTEGER,
    "product_height_cm" INTEGER,
    "product_width_cm" INTEGER,

    CONSTRAINT "product_pkey" PRIMARY KEY ("product_id")
);
