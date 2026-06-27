import { CleanCustomer, CleanProduct, CleanSeller, RawCustomer, RawProduct, RawSeller } from "../prisma/client/client";

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

export const isOrderReview = (data: unknown) : boolean => {
    if (!data) return false;
    
    return typeof data === "object" && "review_id" in data
    && "order_id" in data && "review_score" in data && "review_comment_title" in data 
    && "review_comment_message" in data && "review_creation_date" in data 
    && "review_answer_timestamp" in data;
};

export const isOrder = (data: unknown) : boolean => {
    if (!data) return false;

    return typeof data === "object" && "order_id" in data
    && "customer_id" in data && "order_status" in data && "order_purchase_timestamp" in data 
    && "order_approved_at" in data && "order_delivered_carrier_date" in data 
    && "order_delivered_customer_date" in data && "order_estimated_delivery_date" in data;
};

export const isProduct = (data: unknown) : boolean => {
    if (!data) return false;

    return typeof data === "object" && "product_id" in data
    && "product_category_name" in data && "product_name_lenght" in data 
    && "product_description_lenght" in data && "product_photos_qty" in data 
    && "product_weight_g" in data && "product_length_cm" in data 
    && "product_height_cm" in data && "product_width_cm" in data;
};

export const isSeller = (data: unknown) : boolean => {
    if (!data) return false;

    return typeof data === "object" && "seller_id" in data
    && "seller_zip_code_prefix" in data && "seller_city" in data 
    && "seller_state" in data;
};

export const isCategoryName = (data: unknown) : boolean => {
    if (!data) return false;

    return typeof data === "object" && "product_category_name" in data
    && "product_category_name_english" in data;
};

export const isRawObject = (data: unknown) => {
    return data && typeof data === "object";
};

export const isString = (data: unknown) : data is string => {
    if (!data) return false;
    return typeof data === "string" && data.trim() !== "";
};

export const isNumber = (data: unknown) : data is number => {
    if (!data) return false;
    return typeof data === "number";
}

export const isCleanCustomer = (data: RawCustomer) : data is CleanCustomer => {
    return isString(data.customer_id) && isString(data.customer_unique_id)
        && isNumber(data.customer_zip_code_prefix) && isString(data.customer_city)
        && isString(data.customer_state);
}

export const isCleanSeller = (data: RawSeller) : data is CleanSeller => {
    return isString(data.seller_id) && isNumber(data.seller_zip_code_prefix)
        && isString(data.seller_state) && isString(data.seller_city);
};

export const isCleanProduct = (data: RawProduct) : data is CleanProduct => {
    return isString(data.product_id) && isString(data.product_category_name)
    && isNumber(data.product_name_lenght) && isNumber(data.product_description_lenght)
    && isNumber(data.product_photos_qty) && isNumber(data.product_weight_g)
    && isNumber(data.product_length_cm) && isNumber(data.product_height_cm)
    && isNumber(data.product_width_cm);
};