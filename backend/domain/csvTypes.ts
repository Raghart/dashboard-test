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