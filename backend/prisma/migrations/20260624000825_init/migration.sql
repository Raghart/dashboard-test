/*
  Warnings:

  - You are about to drop the `RawOrderPayment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "raw"."RawOrderPayment";

-- CreateTable
CREATE TABLE "raw"."orderPayments" (
    "order_id" TEXT NOT NULL,
    "payment_sequential" INTEGER,
    "payment_type" TEXT,
    "payment_installments" INTEGER,
    "payment_value" DOUBLE PRECISION,

    CONSTRAINT "orderPayments_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "raw"."itemOrders" (
    "id" INTEGER NOT NULL,
    "order_item_id" INTEGER,
    "order_id" TEXT,
    "product_id" TEXT,
    "seller_id" TEXT,
    "shipping_limit_date" TIMESTAMP(3),
    "price" DOUBLE PRECISION,
    "freight_value" DOUBLE PRECISION,

    CONSTRAINT "itemOrders_pkey" PRIMARY KEY ("id")
);
