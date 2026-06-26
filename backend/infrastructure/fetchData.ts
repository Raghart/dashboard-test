import axios from "axios";
import csv from "csv-parser";
import { Readable } from "stream";
import { CsvData, RawCategName, RawCustomer, RawItemOrder, RawOrder, RawOrderPayment, RawOrderReview, RawProduct, RawSeller } from "../domain/csvTypes";
import { CATNAMEURL, CUSTOMERURL, ITMORDERURL, ORDERSURL, ORDPAYMENTURL, ORDREVIEWSURL, PRODUCTSURL, SELLERSURL } from "../domain/csvUrls";
import { prisma } from "../prisma/prismaClient";
import Papa from 'papaparse';
import { parseRawObject } from "../domain/parseTypes";
import { isRawObject } from "../domain/typeCheckers";

const fetchCSVData = async (url: string) : Promise<Readable> => {
    const res = await axios.get(url);
    return Readable.from(res.data);
};

const fetchCSVPaparse = async (dataStruct: CsvData<any>) => {
    const res = await axios.get(dataStruct.url);

    Papa.parse(res.data, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: "greedy",
        step: dataStruct.stepFunc.bind(dataStruct),
        complete: dataStruct.completeFunc.bind(dataStruct),
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
    const customerCount = await prisma.rawOrderPayment.count();
    console.log(customerCount)
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

const buildCsvLayout = () => {
    const customerStruct : CsvData<RawCustomer> = {
        url: CUSTOMERURL, 
            label: "Customers", 
            dataArray: [],
            stepFunc: async function(row: Papa.ParseStepResult<unknown>, parser: Papa.Parser) {
                if (!parseRawObject(row.data)) {
                    return
                }

                this.dataArray.push({
                    customer_id: row.data?.customer_id ?? "",
                    customer_unique_id: row.data?.customer_unique_id ?? null,
                    customer_zip_code_prefix: row.data?.customer_zip_code_prefix ?? null,
                    customer_city: row.data?.customer_city ?? null,
                    customer_state: row.data?.customer_state ?? null,
                });

                if (this.dataArray.length >= 1000) {
                    parser.pause();

                    await prisma.rawCustomer.createMany({
                        data: this.dataArray,
                    })

                    this.dataArray = [];
                    parser.resume();
                }
            },
            completeFunc: async function() {
                if (this.dataArray.length > 0) {
                    await prisma.rawCustomer.createMany({
                        data: this.dataArray,
                    })
                }
                console.log(`${this.label} has been processed correctly!`);
            },
    }

    const itemOrderStruct: CsvData<RawItemOrder> = {
        url: ITMORDERURL,
            label: "Item orders",
            dataArray: [],
            stepFunc: async function (row: Papa.ParseStepResult<unknown>, parser: Papa.Parser) {
                if (!parseRawObject(row.data)) {
                    return;
                }

                this.dataArray.push({
                    order_id: row.data?.order_id ?? "",
                    order_item_id: row.data?.order_item_id ?? null,
                    product_id: row.data?.product_id ?? null,
                    seller_id: row.data?.seller_id ?? null,
                    shipping_limit_date: row.data.shipping_limit_date 
                        ? new Date(row.data?.shipping_limit_date) : null,
                    price: row.data?.price ?? null,
                    freight_value: row.data?.freight_value ?? null,
                });

                if (this.dataArray.length >= 1000) {
                    parser.pause();

                    await prisma.rawItemOrder.createMany({
                        data: this.dataArray,
                    });

                    this.dataArray = [];
                    parser.resume();
                }
                
            },
            completeFunc: async function() {
                await prisma.rawItemOrder.createMany({
                    data: this.dataArray,
                });
                console.log(`${this.label} data has been processed!`)
            }
    };

    const orderPaymentStruct: CsvData<RawOrderPayment> = {
        url: ORDPAYMENTURL,
        label: "Order payments",
        dataArray: [],
        stepFunc: async function (row: Papa.ParseStepResult<unknown>, parser: Papa.Parser) {
            if (!parseRawObject(row.data)) {
                return;
            }

            this.dataArray.push({
                order_id: row.data?.order_id ?? null,
                payment_sequential: row.data?.payment_sequential ?? null,
                payment_type: row.data?.payment_type ?? null,
                payment_installments: typeof row.data.payment_installments === "number" ?
                     row.data?.payment_installments : null,
                payment_value: row.data?.payment_value ?? null
            });

            if (this.dataArray.length >= 1000) {
                parser.pause();

                await prisma.rawOrderPayment.createMany({
                    data: this.dataArray,
                })

                this.dataArray = [];
                parser.resume();
            }
        },
        completeFunc: async function() {
            if (this.dataArray.length > 0) {
                await prisma.rawOrderPayment.createMany({
                    data: this.dataArray,
                })
            }
            console.log(`${this.label} data has been processed!`)
        },
    };

    const orderReviewsStruct = {

    }
    return [
        //customerStruct,
        //itemOrderStruct,
        orderPaymentStruct,
        /*
        {
            url: ORDREVIEWSURL,
            label: "Order reviews",
            stepFunc: async (row: Papa.ParseStepResult<unknown>) => {
                if (!parseRawObject(row.data)) {
                    return
                }

                await prisma.rawOrderReview.create({
                    data: {
                        review_id: row.data?.review_id ?? null,
                        order_id: row.data?.order_id ?? null,
                        review_score: row.data?.review_score ?? null,
                        review_comment_title: row.data?.review_comment_title ?? null,
                        review_comment_message: row.data?.review_comment_message ?? null,
                        review_creation_date: row.data?.review_creation_date ?? null,
                        review_answer_timestamp: row.data?.review_answer_timestamp ?? null
                    }
                });
                console.log("Order review added!");
            },
        },
        {
            url: ORDERSURL,
            label: "Orders",
            stepFunc: async (row: Papa.ParseStepResult<unknown>) => {
                if (!parseRawObject(row.data)) {
                    return
                }

                await prisma.rawOrder.create({
                    data:{
                        order_id: row.data?.order_id ?? null,
                        customer_id: row.data?.customer_id ?? null,
                        order_status: row.data?.order_status ?? null,
                        order_purchase_timestamp: row.data?.order_purchase_timestamp ?? null,
                        order_approved_at: row.data?.order_approved_at ?? null,
                        order_delivered_carrier_date: row.data?.order_delivered_carrier_date ?? null,
                        order_delivered_customer_date: row.data?.order_delivered_customer_date ?? null,
                        order_estimated_delivery_date: row.data?.order_estimated_delivery_date ?? null
                    }
                });
                console.log("Orders added!");
            },
        },
        {
            url: PRODUCTSURL,
            label: "Products",
            stepFunc: async (row: Papa.ParseStepResult<unknown>) => {
                if (!parseRawObject(row.data)) {
                    return
                }

                await prisma.rawProduct.create({
                    data: {
                        product_id: row.data?.product_id ?? null,
                        product_category_name: row.data?.product_category_name ?? null,
                        product_name_lenght: row.data?.product_name_lenght ?? null,
                        product_description_lenght: row.data?.product_description_lenght ?? null,
                        product_photos_qty: row.data?.product_photos_qty ?? null,
                        product_weight_g: row.data?.product_weight_g ?? null,
                        product_length_cm: row.data?.product_length_cm ?? null,
                        product_height_cm: row.data?.product_height_cm ?? null,
                        product_width_cm: row.data?.product_width_cm ?? null
                    }
                });
                console.log("Products added!");
            },
        },
        {
            url: SELLERSURL,
            label: "Sellers",
            stepFunc: async (row: Papa.ParseStepResult<unknown>) => {
                if (!parseRawObject(row.data)) {
                    return
                }

                await prisma.rawSeller.create({
                    data: {
                        seller_id: row.data?.seller_id ?? null,
                        seller_zip_code_prefix: row.data?.seller_zip_code_prefix ?? null,
                        seller_city: row.data?.seller_city ?? null,
                        seller_state: row.data?.seller_state ?? null
                    }
                });
                console.log("Sellers added!");
            },
        },
        /*
        {
            url: CATNAMEURL,
            label: "Category names",
            stepFunc: async (row: Papa.ParseStepResult<unknown>) => {
                if (!parseRawObject(row.data)) {
                    return;
                }

                await prisma.rawCategName.create({
                    data: {
                        product_category_name: row.data?.product_category_name ?? null,
                        product_category_name_english: row.data?.product_category_name_english ?? null
                    }
                });
                console.log("Category name added!");
            },
        },
        */
    ]
};

const fetchData = async () => {
    const csvDataArr = buildCsvLayout();
    console.log("Starting to iterate!")
    for (const dataStruct of csvDataArr) {
        await fetchCSVPaparse(dataStruct);
    }
};

await fetchData();
//await fetchRawDatabaseData();