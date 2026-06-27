-- CreateTable
CREATE TABLE "clean"."orderReviews" (
    "id" SERIAL NOT NULL,
    "review_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "review_score" INTEGER NOT NULL,
    "review_comment_title" TEXT,
    "review_comment_message" TEXT,
    "review_creation_date" TIMESTAMP(3) NOT NULL,
    "review_answer_timestamp" TIMESTAMP(3),

    CONSTRAINT "orderReviews_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "clean"."orderReviews" ADD CONSTRAINT "orderReviews_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "clean"."orders"("order_id") ON DELETE CASCADE ON UPDATE CASCADE;
