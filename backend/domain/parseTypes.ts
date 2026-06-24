import { RawCustomer, RawItemOrder } from "../prisma/client/client";
import { isCustomer, isItemOrder } from "./typeCheckers";

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