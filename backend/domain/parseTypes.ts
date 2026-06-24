import { RawCustomer, RawItemOrder, RawOrderPayment, RawOrderReview } from "../prisma/client/client";
import { RawProduct } from "./csvTypes";
import { isCustomer, isItemOrder, isOrder, isOrderPayment, isOrderReview, isProduct, isRawObject } from "./typeCheckers";

export const parseCustomer = (data: unknown) : data is RawCustomer => {
    if (isCustomer(data)) {
        return true;
    }
    return false;
};

export const parseItemOrder = (data: unknown) : data is RawItemOrder => {
    if (isItemOrder(data)) {
        return true;
    }
    return false;
};

export const parseOrderPayment = (data: unknown) : data is RawOrderPayment => {
    if (isOrderPayment(data)) {
        return true;
    }
    return false;
};

export const parseRawObject = (data: unknown) : data is any => {
    if (isRawObject(data)) {
        return true;
    }
    return false;
};

export const parseOrderReview = (data: unknown) : data is RawOrderReview => {
    if (!isOrderReview(data)) {
        return true;
    }
    return false
}

export const parseOrder = (data: unknown) : data is RawOrderReview => {
    if (!isOrder(data)) {
        return true;
    }
    return false;
};

export const parseProduct = (data: unknown) : data is RawProduct => {
    if (!isProduct(data)) {
        return true;
    }
    return false;
}