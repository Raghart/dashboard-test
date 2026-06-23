-- AlterTable
ALTER TABLE "raw"."customers" ALTER COLUMN "customer_unique_id" DROP NOT NULL,
ALTER COLUMN "customer_zip_code_prefix" DROP NOT NULL,
ALTER COLUMN "customer_city" DROP NOT NULL,
ALTER COLUMN "customer_state" DROP NOT NULL;
