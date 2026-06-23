/*
  Warnings:

  - You are about to drop the `categoryName` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `orderReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `seller` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "raw"."categoryName";

-- DropTable
DROP TABLE "raw"."order";

-- DropTable
DROP TABLE "raw"."orderReview";

-- DropTable
DROP TABLE "raw"."product";

-- DropTable
DROP TABLE "raw"."seller";

-- CreateTable
CREATE TABLE "raw"."sellers" (
    "seller_id" TEXT NOT NULL,
    "seller_zip_code_prefix" INTEGER,
    "seller_city" TEXT,
    "seller_state" TEXT,

    CONSTRAINT "sellers_pkey" PRIMARY KEY ("seller_id")
);

-- CreateTable
CREATE TABLE "raw"."categoryNames" (
    "product_category_name" TEXT NOT NULL,
    "product_category_name_english" TEXT,

    CONSTRAINT "categoryNames_pkey" PRIMARY KEY ("product_category_name")
);

-- CreateTable
CREATE TABLE "raw"."products" (
    "product_id" TEXT NOT NULL,
    "product_category_name" TEXT,
    "product_name_lenght" INTEGER,
    "product_description_lenght" INTEGER,
    "product_photos_qty" INTEGER,
    "product_weight_g" INTEGER,
    "product_length_cm" INTEGER,
    "product_height_cm" INTEGER,
    "product_width_cm" INTEGER,

    CONSTRAINT "products_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "raw"."orders" (
    "order_id" TEXT NOT NULL,
    "customer_id" TEXT,
    "order_status" TEXT,
    "order_purchase_timestamp" TIMESTAMP(3),
    "order_approved_at" TIMESTAMP(3),
    "order_delivered_carrier_date" TIMESTAMP(3),
    "order_delivered_customer_date" TIMESTAMP(3),
    "order_estimated_delivery_date" TIMESTAMP(3),

    CONSTRAINT "orders_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "raw"."orderReviews" (
    "review_id" TEXT NOT NULL,
    "order_id" TEXT,
    "review_score" INTEGER,
    "review_comment_title" TEXT,
    "review_comment_message" TEXT,
    "review_creation_date" TIMESTAMP(3),
    "review_answer_timestamp" TIMESTAMP(3),

    CONSTRAINT "orderReviews_pkey" PRIMARY KEY ("review_id")
);
