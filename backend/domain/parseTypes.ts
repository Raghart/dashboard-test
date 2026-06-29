import { isRawObject } from "./typeCheckers";

export const parseRawObject = (data: unknown) : data is any => {
    if (isRawObject(data)) {
        return true;
    };
    return false;
};

export const parseRawDate = (data: any): Date | null => {
    if (!data) return null;
    const newDate = new Date(data)
    return isNaN(newDate.getTime()) ? null : newDate;
};