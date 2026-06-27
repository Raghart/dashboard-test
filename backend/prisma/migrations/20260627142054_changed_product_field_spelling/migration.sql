/*
  Warnings:

  - You are about to drop the column `product_description_length` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `product_name_length` on the `products` table. All the data in the column will be lost.
  - Added the required column `product_description_lenght` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_name_lenght` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "clean"."products" DROP COLUMN "product_description_length",
DROP COLUMN "product_name_length",
ADD COLUMN     "product_description_lenght" INTEGER NOT NULL,
ADD COLUMN     "product_name_lenght" INTEGER NOT NULL;
