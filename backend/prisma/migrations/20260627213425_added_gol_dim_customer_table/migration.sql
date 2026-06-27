/*
  Warnings:

  - You are about to drop the `factSales` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "gold"."factSales";

-- CreateTable
CREATE TABLE "gold"."fact_sales" (
    "id" SERIAL NOT NULL,
    "customer_id" TEXT NOT NULL,
    "item_price" DECIMAL(65,30) NOT NULL,
    "freight_value" DECIMAL(65,30) NOT NULL,
    "payment_value_allocated" DOUBLE PRECISION NOT NULL,
    "is_delivered" BOOLEAN NOT NULL,
    "is_canceled" BOOLEAN NOT NULL,
    "is_on_time" BOOLEAN NOT NULL,

    CONSTRAINT "fact_sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gold"."dim_customer" (
    "customer_id" TEXT NOT NULL,
    "customer_state" TEXT NOT NULL,
    "customer_city" TEXT NOT NULL,

    CONSTRAINT "dim_customer_pkey" PRIMARY KEY ("customer_id")
);

-- AddForeignKey
ALTER TABLE "gold"."fact_sales" ADD CONSTRAINT "fact_sales_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "gold"."dim_customer"("customer_id") ON DELETE CASCADE ON UPDATE CASCADE;
