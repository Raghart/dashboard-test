import axios from "axios";
import csv from "csv-parser";
import { Readable } from "stream";
import { RawCustomer, RawItemOrder, RawOrderPayment, RawOrderReview } from "../domain/csvTypes";
import { CUSTOMERURL, ITMORDERURL, ORDERSURL, ORDPAYMENTURL, ORDREVIEWSURL } from "../domain/csvUrls";

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

const fetchRawItemOrders = async () : Promise<RawItemOrder[]> => {
    const stream = await fetchCSVData(ITMORDERURL);

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
            res(itemOrdersArr);
        }).on("error", (err) => rej(err));
    });
};

const fetchOrderPayments = async () : Promise<RawOrderPayment[]> => {
    const stream = await fetchCSVData(ORDPAYMENTURL);

    return new Promise((res, rej) => {
        const orderPaymentsArr: RawOrderPayment[] = [];
        stream.pipe(csv()).on("data", (row: any) => orderPaymentsArr.push({
            order_id: row.order_id,
            payment_sequential: parseInt(row.payment_sequential),
            payment_type: row.payment_type,
            payment_installments: parseInt(row.payment_installments),
            payment_value: parseFloat(row.payment_value)
        }))
        .on("end", () => {
            res(orderPaymentsArr);
        }).on("error", (err) => rej(err));
    });
};

const fetchOrderReviews = async () : Promise<RawOrderReview[]> => {
    const stream = await fetchCSVData(ORDREVIEWSURL);

    return new Promise((res, rej) => {
        const orderReviewsArr: RawOrderReview[] = [];

        stream.pipe(csv()).on("data", (row: any) => orderReviewsArr.push({
            review_id: row.review_id,
            order_id: row.order_id,
            review_score: parseInt(row.review_score),
            review_comment_title: row.review_comment_title,
            review_comment_message: row.review_comment_message,
            review_creation_date: new Date(row.review_creation_date),
            review_answer_timestamp: new Date(row.review_answer_timestamp)
        }))
        .on("end", () => {
            res(orderReviewsArr);
        }).on("error", (err) => rej(err));
    });
};

const fetchOrders = async () : Promise<any[]> => {
    const stream = await fetchCSVData(ORDERSURL);

    return new Promise((res, rej) => {
        const ordersArr: any[] = [];

        stream.pipe(csv()).on("data", (row: any) => ordersArr.push(row))
        .on("end", () => res(ordersArr))
        .on("error", (err) => rej(err));
    });
};

const t = await fetchOrders();
console.log(t);