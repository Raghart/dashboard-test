-- CreateTable
CREATE TABLE "raw"."RawOrderPayment" (
    "order_id" TEXT NOT NULL,
    "payment_sequential" INTEGER,
    "payment_type" TEXT,
    "payment_installments" INTEGER,
    "payment_value" DOUBLE PRECISION,

    CONSTRAINT "RawOrderPayment_pkey" PRIMARY KEY ("order_id")
);
