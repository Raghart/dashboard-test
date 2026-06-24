export const isCustomer = (data: unknown) : boolean => {
    if (!data) return false;

    return typeof data === "object" && "customer_id" in data 
    && "customer_unique_id" in data && "customer_zip_code_prefix" in data
    && "customer_city" in data && "customer_state" in data;
};

export const isItemOrder = (data: unknown) : boolean => {
    if (!data) return false;

    return typeof data === "object" && "order_id" in data
    && "order_item_id" in data && "product_id" in data && "seller_id" in data 
    && "shipping_limit_date" in data && "price" in data && "freight_value" in data;
};

export const isOrderPayment = (data: unknown) : boolean => {
    if (!data) return false;

    return typeof data === "object" && "order_id" in data && "payment_sequential" in data 
    && "payment_type" in data && "payment_installments" in data && "payment_value" in data;
};

const isOrderReview = (data: unknown) : boolean => {
    if (!data) return false;
    
    return typeof data === "object" && "review_id" in data
    && "order_id" in data && "review_score" in data && "review_comment_title" in data 
    && "review_comment_message" in data && "review_creation_date" in data 
    && "review_answer_timestamp" in data;
};

export const isRawObject = (data: unknown) => {
    return data && typeof data === "object";
}