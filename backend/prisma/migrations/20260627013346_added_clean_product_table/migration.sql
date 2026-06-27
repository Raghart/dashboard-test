-- CreateTable
CREATE TABLE "clean"."products" (
    "product_id" TEXT NOT NULL,
    "product_category_name" TEXT NOT NULL,
    "product_name_length" INTEGER NOT NULL,
    "product_description_length" INTEGER NOT NULL,
    "product_photos_qty" INTEGER NOT NULL,
    "product_weight_g" INTEGER NOT NULL,
    "product_length_cm" INTEGER NOT NULL,
    "product_height_cm" INTEGER NOT NULL,
    "product_width_cm" INTEGER NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("product_id")
);

-- AddForeignKey
ALTER TABLE "clean"."products" ADD CONSTRAINT "products_product_category_name_fkey" FOREIGN KEY ("product_category_name") REFERENCES "clean"."categoryNames"("product_category_name") ON DELETE CASCADE ON UPDATE CASCADE;
