-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "clean";

-- CreateTable
CREATE TABLE "clean"."categoryNames" (
    "product_category_name" TEXT NOT NULL,
    "product_category_name_english" TEXT NOT NULL,

    CONSTRAINT "categoryNames_pkey" PRIMARY KEY ("product_category_name")
);
