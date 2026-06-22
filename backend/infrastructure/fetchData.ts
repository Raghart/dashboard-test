import axios from "axios";
import csv from "csv-parser";
import { Readable } from "stream";
import { RawCustomer } from "../domain/csvTypes";
import { CUSTOMERURL, ITEMORDERSURL } from "../domain/csvUrls";

const fetchRawCustomers = async () : Promise<RawCustomer[]> => {
    const res = await axios.get(CUSTOMERURL);
    const stream = Readable.from(res.data);

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
    const res = await axios.get(ITEMORDERSURL);
    const stream = Readable.from(res.data);

    return new Promise((res, rej) => {
        const itemOrdersArr: any[] = [];

        stream.pipe(csv()).on("data", (row: any) => itemOrdersArr.push(row))
        .on("end", () => {
            console.log(`There are currently ${itemOrdersArr.length} items orders`);
            res(itemOrdersArr);
        }).on("error", (err) => rej(err));
    });
};

const t = await fetchRawCustomers();
console.log(t);