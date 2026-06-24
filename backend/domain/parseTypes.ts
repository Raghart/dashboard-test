import { RawCustomer, RawItemOrder, RawOrderPayment } from "../prisma/client/client";
import { isCustomer, isItemOrder, isOrderPayment, isRawObject } from "./typeCheckers";

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
}

export const parseRawObject = (data: unknown) : data is any => {
    if (isRawObject(data)) {
        return true;
    }
    return false;
}