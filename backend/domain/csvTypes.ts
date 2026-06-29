export interface CsvData<T> {
    url: string
    label: string
    dataArray: T[] 
    stepFunc: (row: Papa.ParseStepResult<unknown>, parser: Papa.Parser) => void
    completeFunc: () => void
}

export interface RawItemData {
    order_item_id: number | null;
    order_id: string | null;
    product_id: string | null;
    seller_id: string | null;
    shipping_limit_date: Date | null;
    price: number | null;
    freight_value: number | null;
}

export interface RawOrderReviewData {
    order_id: string | null;
    review_id: string | null;
    review_score: number | null;
    review_comment_title: string | null;
    review_comment_message: string | null;
    review_creation_date: Date | null;
    review_answer_timestamp: Date | null;
}

export interface RawOrderPaymentData {
    order_id: string | null;
    payment_sequential: number | null;
    payment_type: string | null;
    payment_installments: number | null;
    payment_value: number | null;
}

export interface FactSalesData {
    order_id: string;
    product_id: string;
    freight_value: number;
    customer_id: string;
    date_id: number;
    item_price: number;
    payment_value_allocated: number;
    is_delivered: boolean;
    is_canceled: boolean;
    is_on_time: boolean;
}