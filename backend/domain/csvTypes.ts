export interface CsvData<T> {
    url: string
    label: string
    dataArray: T[] 
    stepFunc: (row: Papa.ParseStepResult<unknown>, parser: Papa.Parser) => void
    completeFunc: () => void
}

export interface FactSalesData {
    order_id: string;
    product_id: string;
    freight_value: number;
    customer_id: string;
    date_id: number;
    item_price: number;
    payment_value_allocated: number;
    is_delivered: boolean;
    is_canceled: boolean;
    is_on_time: boolean;
}