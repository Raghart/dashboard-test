-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "gold";

-- CreateTable
CREATE TABLE "gold"."factSales" (
    "id" SERIAL NOT NULL,
    "item_price" DECIMAL(65,30) NOT NULL,
    "freight_value" DECIMAL(65,30) NOT NULL,
    "payment_value_allocated" DOUBLE PRECISION NOT NULL,
    "is_delivered" BOOLEAN NOT NULL,
    "is_canceled" BOOLEAN NOT NULL,
    "is_on_time" BOOLEAN NOT NULL,

    CONSTRAINT "factSales_pkey" PRIMARY KEY ("id")
);
