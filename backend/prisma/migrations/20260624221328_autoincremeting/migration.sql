-- AlterTable
CREATE SEQUENCE "raw".itemorders_id_seq;
ALTER TABLE "raw"."itemOrders" ALTER COLUMN "id" SET DEFAULT nextval('"raw".itemorders_id_seq');
ALTER SEQUENCE "raw".itemorders_id_seq OWNED BY "raw"."itemOrders"."id";
