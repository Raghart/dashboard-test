import { isDate } from "node:util/types";
import { CleanCustomer, CleanItemOrder, CleanOrder, CleanOrderPayment, CleanOrderReview, 
    CleanProduct, CleanSeller, RawCustomer, RawItemOrder, RawOrderReview, 
    RawProduct, RawSeller } from "../prisma/client/client";

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

export const isCleanOrder = (data: any) : data is CleanOrder => {
    return isString(data.order_id) && isString(data.customer_id)
    && isString(data.order_status) && isDate(data.order_purchase_timestamp)
    && isDate(data.order_approved_at) && isDate(data.order_delivered_carrier_date)
    && isDate(data.order_delivered_customer_date) && isDate(data.order_estimated_delivery_date);
};

export const isCleanOrderPayment = (data: any) : data is CleanOrderPayment => {
    return isString(data.order_id) && isString(data.payment_type)
    && isNumber(data.payment_sequential) && isNumber(data.payment_installments)
    && isNumber(data.payment_value);
};

export const isCleanItemOrder = (data: RawItemOrder) : data is CleanItemOrder => {
    return isString(data.order_id) && isString(data.product_id)
    && isString(data.seller_id) && isNumber(data.order_item_id)
    && isNumber(data.price) && isNumber(data.freight_value)
    && isDate(data.shipping_limit_date);
};

export const isCleanOrderReview = (data: RawOrderReview) : data is CleanOrderReview => {
    return isString(data.order_id) && isString(data.review_id)
    && isNumber(data.review_score) && isDate(data.review_creation_date);
};