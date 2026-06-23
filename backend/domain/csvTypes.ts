export interface RawCustomer {
    customer_id: string,
    customer_unique_id: string,
    customer_zip_code_prefix: number,
    customer_city: string,
    customer_state: string
}

export interface RawItemOrder {
    order_id: string,
    order_item_id: number,
    product_id: string,
    seller_id: string,
    shipping_limit_date: Date,
    price: number,
    freight_value: number
}

export interface RawOrderPayment {
    order_id: string,
    payment_sequential: number,
    payment_type: string,
    payment_installments: number,
    payment_value: number
}

export interface RawOrderReview {
    review_id: string,
    order_id: string,
    review_score: number,
    review_comment_title: string,
    review_comment_message: string,
    review_creation_date: Date,
    review_answer_timestamp: Date
};

export interface RawOrder {
    order_id: string,
    customer_id: string,
    order_status: string,
    order_purchase_timestamp: Date,
    order_approved_at: Date,
    order_delivered_carrier_date: Date,
    order_delivered_customer_date: Date,
    order_estimated_delivery_date: Date
};

export interface RawProduct {
    product_id: string,
    product_category_name: string,
    product_name_lenght: number,
    product_description_lenght: number,
    product_photos_qty: number,
    product_weight_g: number,
    product_length_cm: number,
    product_height_cm: number,
    product_width_cm: number
};

export interface RawSeller {
    seller_id: string,
    seller_zip_code_prefix: number,
    seller_city: string,
    seller_state: string
};