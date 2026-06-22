import axios from "axios";
import csv from "csv-parser";
import { Readable } from "stream";
import { Customer } from "../domain/csvTypes";

const fetchCustomers = async () => {
    const url = "https://raw.githubusercontent.com/spdrio/Brazilian-E-Commerce-Public-Dataset-by-Olist/refs/heads/master/files/olist_customers_dataset.csv";
    const res = await axios.get(url);

    const stream = Readable.from(res.data);
    return new Promise((res, rej) => {
        const resultsArr: Customer[] = [];

        stream.pipe(csv()).on("data", (row: Customer) => resultsArr.push(row))
        .on("end", () => {
            console.log(`Download finished with ${resultsArr.length}`);
            res(resultsArr);
        });
    });
};
const customersArr = await fetchCustomers()
console.log(customersArr);