/*
  Warnings:

  - Added the required column `order_id` to the `fact_sales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "gold"."fact_sales" ADD COLUMN     "order_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "gold"."dim_order" (
    "order_id" TEXT NOT NULL,
    "order_status" TEXT NOT NULL,
    "order_purchase_timestamp" TIMESTAMP(3) NOT NULL,
    "order_approved_at" TIMESTAMP(3) NOT NULL,
    "order_delivered_carrier_date" TIMESTAMP(3) NOT NULL,
    "order_delivered_customer_date" TIMESTAMP(3) NOT NULL,
    "order_estimated_delivery_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dim_order_pkey" PRIMARY KEY ("order_id")
);

-- AddForeignKey
ALTER TABLE "gold"."fact_sales" ADD CONSTRAINT "fact_sales_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "gold"."dim_order"("order_id") ON DELETE CASCADE ON UPDATE CASCADE;
