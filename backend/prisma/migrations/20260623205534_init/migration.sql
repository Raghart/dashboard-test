-- AlterTable
ALTER TABLE "raw"."seller" ALTER COLUMN "seller_zip_code_prefix" DROP NOT NULL,
ALTER COLUMN "seller_city" DROP NOT NULL,
ALTER COLUMN "seller_state" DROP NOT NULL;
