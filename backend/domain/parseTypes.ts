export const parseRawDate = (data: any): Date | null => {
    if (!data) return null;
    const newDate = new Date(data)
    return isNaN(newDate.getTime()) ? null : newDate;
};