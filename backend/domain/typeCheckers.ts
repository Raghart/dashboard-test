export const isCustomer = (data: unknown) : boolean => {
    if (!data) return false;

    return typeof data === "object" && "customer_id" in data 
    && "customer_unique_id" in data && "customer_zip_code_prefix" in data
    && "customer_city" in data && "customer_state" in data;
};