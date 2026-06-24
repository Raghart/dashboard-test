import axios from "axios";
import csv from "csv-parser";
import { Readable } from "stream";
import { CsvData, RawCategName, RawCustomer, RawItemOrder, RawOrder, RawOrderPayment, RawOrderReview, RawProduct, RawSeller } from "../domain/csvTypes";
import { CATNAMEURL, CUSTOMERURL, ITMORDERURL, ORDERSURL, ORDPAYMENTURL, ORDREVIEWSURL, PRODUCTSURL, SELLERSURL } from "../domain/csvUrls";
import { prisma } from "../prisma/prismaClient";
import Papa from 'papaparse';
import { isCustomer } from "../domain/typeCheckers";
import { parseCustomer, parseItemOrder, parseOrderPayment, parseRawObject } from "../domain/parseTypes";

const fetchCSVData = async (url: string) : Promise<Readable> => {
    const res = await axios.get(url);
    return Readable.from(res.data);
};

const fetchCSVPaparse = async (dataStruct: CsvData) => {
    const res = await axios.get(dataStruct.url);
    Papa.parse(res.data, {
        header: true,
        dynamicTyping: true,
        step: dataStruct.stepFunc,
        complete: function() {
            console.log(`${dataStruct.label} has processed correctly!`)
        }
    });
};

const fetchCustomers = async () : Promise<RawCustomer[]> => {
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

const fetcItemOrders = async () : Promise<RawItemOrder[]> => {
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

const fetchOrders = async () : Promise<RawOrder[]> => {
    const stream = await fetchCSVData(ORDERSURL);

    return new Promise((res, rej) => {
        const ordersArr: RawOrder[] = [];

        stream.pipe(csv()).on("data", (row: any) => ordersArr.push({
            order_id: row.order_id,
            customer_id: row.customer_id,
            order_status: row.order_status,
            order_purchase_timestamp: new Date(row.order_purchase_timestamp),
            order_approved_at: new Date(row.order_approved_at),
            order_delivered_carrier_date: new Date(row.order_delivered_carrier_date),
            order_delivered_customer_date: new Date(row.order_delivered_customer_date),
            order_estimated_delivery_date: new Date(row.order_estimated_delivery_date)
        }))
        .on("end", () => res(ordersArr))
        .on("error", (err) => rej(err));
    });
};

const fetchProducts = async () : Promise<RawProduct[]> => {
    const stream = await fetchCSVData(PRODUCTSURL);
    return new Promise((res, rej) => {
        const productsArr: RawProduct[] = [];
        stream.pipe(csv()).on("data", (row: any) => productsArr.push({
            product_id: row.product_id,
            product_category_name: row.product_category_name,
            product_name_lenght: parseInt(row.product_name_lenght),
            product_description_lenght: parseInt(row.product_description_lenght),
            product_photos_qty: parseInt(row.product_photos_qty),
            product_weight_g: parseInt(row.product_weight_g),
            product_length_cm: parseInt(row.product_length_cm),
            product_height_cm: parseInt(row.product_height_cm),
            product_width_cm: parseInt(row.product_width_cm)
        }))
        .on("end", () => res(productsArr))
        .on("error", (err) => rej(err))
    });
};

const fetchSellers = async () : Promise<RawSeller[]> => {
    const stream = await fetchCSVData(SELLERSURL);

    return new Promise((res, rej) => {
        const sellersArr: RawSeller[] = [];

        stream.pipe(csv()).on("data", (row: any) => sellersArr.push({
            seller_id: row.seller_id,
            seller_zip_code_prefix: parseInt(row.seller_zip_code_prefix),
            seller_city: row.seller_city,
            seller_state: row.seller_state
        }))
        .on("end", () => res(sellersArr))
        .on("error", (err) => rej(err));
    });
};

const fetchCategNames = async () => {
    const stream = await fetchCSVData(CATNAMEURL);
    
    return new Promise((res, rej) => {
        const categNamesArr: RawCategName[] = [];

        stream.pipe(csv()).on("data", (row: RawCategName) => categNamesArr.push({
            product_category_name: row.product_category_name,
            product_category_name_english: row.product_category_name_english
        }))
        .on("end", () => res(categNamesArr))
        .on("error", (err) => rej(err))
    });
};

const checkRawDatabase = async () : Promise<boolean> => {
    const customerCount = await prisma.rawCustomer.count();
    return customerCount === 0;
};

const fetchRawDatabaseData = async () : Promise<void> => {
    const isRaw = await checkRawDatabase();
    if (!isRaw) {
        return
    }

    await Promise.all([
        fetchCustomers(),
        fetcItemOrders(),
        fetchOrderPayments(),
        fetchOrderReviews(),
        fetchOrders(),
        fetchProducts(),
        fetchSellers(),
        fetchCategNames(),
    ])
};

const buildCsvLayout = (): CsvData[] => {
    return [
        {
            url: CUSTOMERURL, 
            label: "Customers", 
            stepFunc: async (row: Papa.ParseStepResult<unknown>) => {
                if (!parseRawObject(row.data)) {
                    return
                }

                await prisma.rawCustomer.create({
                    data: {
                        customer_id: row.data?.customer_id ?? null,
                        customer_unique_id: row.data?.customer_unique_id ?? null,
                        customer_zip_code_prefix: row.data?.customer_zip_code_prefix ?? null,
                        customer_city: row.data?.customer_city ?? null,
                        customer_state: row.data?.customer_state ?? null, 
                    }
                });
                console.log("Customer added!")
            }
        },
        {
            url: ITMORDERURL,
            label: "Item orders",
            stepFunc: (row: Papa.ParseStepResult<unknown>) => {
                if (!parseRawObject(row.data)) {
                    return;
                }

                console.log(row.data);
            }
        },
        {
            url: ORDPAYMENTURL,
            label: "Order payments",
            stepFunc: (row: Papa.ParseStepResult<unknown>) => {
                if (!parseRawObject(row.data)) {
                    return;
                }

                console.log(row.data)
            }
        },
        {
            url: ORDREVIEWSURL,
            label: "Order reviews",
            stepFunc(row: Papa.ParseStepResult<unknown>) {
                if (!parseRawObject(row.data)) {
                    return
                }

                console.log(row.data);
            },
        },
        {
            url: ORDERSURL,
            label: "Orders",
            stepFunc(row: Papa.ParseStepResult<unknown>) {
                if (!parseRawObject(row.data)) {
                    return
                }

                console.log(row.data)
            },
        },
        {
            url: PRODUCTSURL,
            label: "Products",
            stepFunc(row: Papa.ParseStepResult<unknown>) {
                if (!parseRawObject(row.data)) {
                    return
                }

                console.log(row.data)
            },
        },
        {
            url: SELLERSURL,
            label: "Sellers",
            stepFunc(row: Papa.ParseStepResult<unknown>) {
                if (!parseRawObject(row.data)) {
                    return
                }

                console.log(row.data)
            },
        },
        {
            url: CATNAMEURL,
            label: "Category names",
            stepFunc(row: Papa.ParseStepResult<unknown>) {
                if (!parseRawObject(row.data)) {
                    return;
                }

                console.log(row.data)
            },
        },
    ]
};

const csvDataArr = buildCsvLayout();
for (const dataStruct of csvDataArr) {
    await fetchCSVPaparse(dataStruct);
}
//await fetchRawDatabaseData();