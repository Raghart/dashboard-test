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