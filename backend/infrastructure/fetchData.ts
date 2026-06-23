import axios from "axios";
import csv from "csv-parser";
import { Readable } from "stream";
import { RawCustomer, RawItemOrder } from "../domain/csvTypes";
import { CUSTOMERURL, ITEMORDERSURL } from "../domain/csvUrls";

const fetchCSVData = async (url: string) : Promise<Readable> => {
    const res = await axios.get(url);
    return Readable.from(res.data);
};

const fetchRawCustomers = async () : Promise<RawCustomer[]> => {
    const stream = await fetchCSVData(CUSTOMERURL);

    return new Promise((res, rej) => {
        const resultsArr: RawCustomer[] = [];

        stream.pipe(csv()).on("data", (row: any) => resultsArr.push({
            customer_id: row.customer_id,
            customer_unique_id: row.customer_unique_id,
            customer_zip_code_prefix: parseInt(row.customer_zip_code_prefix),
            customer_city: row.customer_city,
            customer_state: row.customer_state
        }))
        .on("end", () => {
            console.log(`Download finished with ${resultsArr.length}`);
            res(resultsArr);
        }).on("error", (err) => rej(err));
    });
};

const fetchRawItemOrders = async () => {
    const stream = await fetchCSVData(ITEMORDERSURL);

    return new Promise((res, rej) => {
        const itemOrdersArr: RawItemOrder[] = [];

        stream.pipe(csv()).on("data", (row: any) => itemOrdersArr.push({
            order_id: row.order_id,
            order_item_id: parseInt(row.order_item_id),
            product_id: row.product_id,
            seller_id: row.seller_id,
            shipping_limit_date: new Date(row.shipping_limit_date),
            price: parseFloat(row.price),
            freight_value: parseFloat(row.freight_value)
        }))
        .on("end", () => {
            console.log(`There are currently ${itemOrdersArr.length} items orders`);
            res(itemOrdersArr);
        }).on("error", (err) => rej(err));
    });
};

const t = await fetchRawItemOrders();
console.log(t);