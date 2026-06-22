import axios from "axios";
import csv from "csv-parser";
import { Readable } from "stream";
import { Customer } from "../domain/csvTypes";
import { CUSTOMERURL, ITEMORDERSURL } from "../domain/csvUrls";

const fetchRawCustomers = async () => {
    const res = await axios.get(CUSTOMERURL);
    const stream = Readable.from(res.data);

    return new Promise((res, rej) => {
        const resultsArr: Customer[] = [];

        stream.pipe(csv()).on("data", (row: Customer) => resultsArr.push(row))
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