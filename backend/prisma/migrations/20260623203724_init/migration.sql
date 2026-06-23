-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "raw";

-- CreateTable
CREATE TABLE "raw"."customers" (
    "customer_id" TEXT NOT NULL,
    "customer_unique_id" TEXT NOT NULL,
    "customer_zip_code_prefix" INTEGER NOT NULL,
    "customer_city" TEXT NOT NULL,
    "customer_state" TEXT NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("customer_id")
);
