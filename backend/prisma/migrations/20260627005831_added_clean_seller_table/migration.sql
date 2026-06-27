-- CreateTable
CREATE TABLE "clean"."sellers" (
    "seller_id" TEXT NOT NULL,
    "seller_zip_code_prefix" INTEGER NOT NULL,
    "seller_city" TEXT NOT NULL,
    "seller_state" TEXT NOT NULL,

    CONSTRAINT "sellers_pkey" PRIMARY KEY ("seller_id")
);
