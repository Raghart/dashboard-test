import { RawCustomer } from "../prisma/client/client";
import { isCustomer } from "./typeCheckers";

export const parseCustomer = (data: unknown) : data is RawCustomer => {
    if (isCustomer(data)) {
        return true
    }
    return false
};