/*
  Warnings:

  - Added the required column `shipping_limit_date` to the `dim_order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_id` to the `fact_sales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "gold"."dim_order" ADD COLUMN     "shipping_limit_date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "gold"."fact_sales" ADD COLUMN     "date_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "gold"."dim_date" (
    "date_id" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "weekday" TEXT NOT NULL,
    "is_festive" BOOLEAN NOT NULL,

    CONSTRAINT "dim_date_pkey" PRIMARY KEY ("date_id")
);

-- AddForeignKey
ALTER TABLE "gold"."fact_sales" ADD CONSTRAINT "fact_sales_date_id_fkey" FOREIGN KEY ("date_id") REFERENCES "gold"."dim_date"("date_id") ON DELETE CASCADE ON UPDATE CASCADE;
