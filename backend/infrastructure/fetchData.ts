import axios from "axios";
import csv from "csv-parser";
import { Readable } from "stream";
import { Customer } from "../domain/csvTypes";
import { CUSTOMERURL } from "../domain/csvUrls";

const fetchCustomers = async () => {
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
const customersArr = await fetchCustomers()
console.log(customersArr);