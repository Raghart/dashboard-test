-- CreateTable
CREATE TABLE "raw"."orderReview" (
    "review_id" TEXT NOT NULL,
    "order_id" TEXT,
    "review_score" INTEGER,
    "review_comment_title" TEXT,
    "review_comment_message" TEXT,
    "review_creation_date" TIMESTAMP(3),
    "review_answer_timestamp" TIMESTAMP(3),

    CONSTRAINT "orderReview_pkey" PRIMARY KEY ("review_id")
);
