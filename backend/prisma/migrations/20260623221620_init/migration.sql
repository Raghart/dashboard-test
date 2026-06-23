/*
  Warnings:

  - You are about to drop the `categName` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "raw"."categName";

-- CreateTable
CREATE TABLE "raw"."categoryName" (
    "id" INTEGER NOT NULL,
    "product_category_name" TEXT,
    "product_category_name_english" TEXT,

    CONSTRAINT "categoryName_pkey" PRIMARY KEY ("id")
);
