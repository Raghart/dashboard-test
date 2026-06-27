-- CreateTable
CREATE TABLE "clean"."orders" (
    "order_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "order_status" TEXT NOT NULL,
    "order_purchase_timestamp" TIMESTAMP(3) NOT NULL,
    "order_approved_at" TIMESTAMP(3) NOT NULL,
    "order_delivered_carrier_date" TIMESTAMP(3) NOT NULL,
    "order_delivered_customer_date" TIMESTAMP(3) NOT NULL,
    "order_estimated_delivery_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("order_id")
);

-- AddForeignKey
ALTER TABLE "clean"."orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "clean"."customers"("customer_id") ON DELETE CASCADE ON UPDATE CASCADE;
