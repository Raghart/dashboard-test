-- CreateTable
CREATE TABLE "clean"."orderPayments" (
    "id" SERIAL NOT NULL,
    "order_id" TEXT NOT NULL,
    "payment_sequential" INTEGER NOT NULL,
    "payment_type" TEXT NOT NULL,
    "payment_installments" INTEGER NOT NULL,
    "payment_value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "orderPayments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "clean"."orderPayments" ADD CONSTRAINT "orderPayments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "clean"."orders"("order_id") ON DELETE CASCADE ON UPDATE CASCADE;
