-- CreateTable
CREATE TABLE "raw"."order" (
    "order_id" TEXT NOT NULL,
    "customer_id" TEXT,
    "order_status" TEXT,
    "order_purchase_timestamp" TIMESTAMP(3),
    "order_approved_at" TIMESTAMP(3),
    "order_delivered_carrier_date" TIMESTAMP(3),
    "order_delivered_customer_date" TIMESTAMP(3),
    "order_estimated_delivery_date" TIMESTAMP(3),

    CONSTRAINT "order_pkey" PRIMARY KEY ("order_id")
);
