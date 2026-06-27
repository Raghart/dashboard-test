/*
  Warnings:

  - You are about to alter the column `item_price` on the `fact_sales` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `freight_value` on the `fact_sales` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - Added the required column `product_id` to the `fact_sales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "gold"."fact_sales" ADD COLUMN     "product_id" TEXT NOT NULL,
ALTER COLUMN "item_price" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "freight_value" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "gold"."dim_product" (
    "product_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "dim_product_pkey" PRIMARY KEY ("product_id")
);

-- AddForeignKey
ALTER TABLE "gold"."fact_sales" ADD CONSTRAINT "fact_sales_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "gold"."dim_product"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;
