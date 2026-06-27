-- CreateTable
CREATE TABLE "clean"."itemOrders" (
    "id" SERIAL NOT NULL,
    "order_item_id" INTEGER NOT NULL,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "seller_id" TEXT NOT NULL,
    "shipping_limit_date" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "freight_value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "itemOrders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "clean"."itemOrders" ADD CONSTRAINT "itemOrders_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "clean"."orders"("order_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clean"."itemOrders" ADD CONSTRAINT "itemOrders_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "clean"."products"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clean"."itemOrders" ADD CONSTRAINT "itemOrders_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "clean"."sellers"("seller_id") ON DELETE CASCADE ON UPDATE CASCADE;
