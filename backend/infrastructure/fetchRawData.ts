import axios from "axios";
import { CsvData, RawItemData, RawOrderReviewData } from "../domain/csvTypes";
import { CATNAMEURL, CUSTOMERURL, ITMORDERURL, ORDERSURL, ORDPAYMENTURL, ORDREVIEWSURL, PRODUCTSURL, 
    SELLERSURL } from "../domain/csvUrls";
import { prisma } from "../prisma/prismaClient";
import Papa from 'papaparse';
import { parseRawDate, parseRawObject } from "../domain/parseTypes";
import { RawCategName, RawCustomer, RawOrder, RawOrderPayment, RawOrderReview, RawProduct, RawSeller } from "../prisma/client/client";

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

const checkRawDatabase = async () : Promise<boolean> => {
    const customerCount = await prisma.rawCustomer.count();
    return customerCount === 0;
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

    const itemOrderStruct: CsvData<RawItemData> = {
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
                if (this.dataArray.length > 0) {
                    await prisma.rawItemOrder.createMany({
                        data: this.dataArray,
                    });
                }
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
                id: 0,
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
            console.log(`${this.label} data has been processed!`);
        },
    };

    const orderReviewsStruct: CsvData<RawOrderReviewData> = {
        url: ORDREVIEWSURL,
        label: "Order reviews",
        dataArray: [],
        stepFunc: async function (row: Papa.ParseStepResult<unknown>, parser: Papa.Parser) {
            if (!parseRawObject(row.data)) {
                return
            }

            this.dataArray.push({
                review_id: row.data?.review_id ?? null,
                order_id: row.data?.order_id ?? null,
                review_score: row.data?.review_score ?? null,
                review_comment_title: row.data?.review_comment_title ? 
                    `${row.data.review_comment_title}` : null,
                review_comment_message: row.data?.review_comment_message ? 
                    `${row.data.review_comment_message}` : null,
                review_creation_date: row.data?.review_creation_date ? 
                    new Date(row.data.review_creation_date) : null,
                review_answer_timestamp: row.data?.review_answer_timestamp ? 
                    new Date(row.data.review_answer_timestamp) : null
            });

            if (this.dataArray.length >= 1000) {
                parser.pause();

                await prisma.rawOrderReview.createMany({
                    data: this.dataArray,
                });

                this.dataArray = [];
                parser.resume();
            }
        },
        completeFunc: async function() {
            if (this.dataArray.length > 0) {
                await prisma.rawOrderReview.createMany({
                    data: this.dataArray,
                });
            }
            console.log(`${this.label} data has been processed!`);
        },
    };

    const ordersStruct: CsvData<RawOrder> = {
        url: ORDERSURL,
        label: "Orders",
        dataArray: [],
        stepFunc: async function (row: Papa.ParseStepResult<unknown>, parser: Papa.Parser) {
            if (!parseRawObject(row.data)) {
                return
            };

            this.dataArray.push({
                order_id: row.data?.order_id ?? "",
                customer_id: row.data?.customer_id ?? null,
                order_status: row.data?.order_status ?? null,
                order_purchase_timestamp: row.data?.order_purchase_timestamp ?
                    new Date(row.data.order_purchase_timestamp) : null,
                order_approved_at: parseRawDate(row.data?.order_approved_at),
                order_delivered_carrier_date: row.data?.order_delivered_carrier_date ?
                     new Date(row.data.order_delivered_carrier_date) : null,
                order_delivered_customer_date: row.data?.order_delivered_customer_date ?
                    new Date(row.data.order_delivered_customer_date) : null,
                order_estimated_delivery_date: row.data?.order_estimated_delivery_date ?
                    new Date(row.data.order_estimated_delivery_date) : null,
            })

            if (this.dataArray.length >= 1000) {
                parser.pause();

                await prisma.rawOrder.createMany({
                    data: this.dataArray,
                });

                this.dataArray = [];
                parser.resume();
            }
            
        },
        completeFunc: async function() {
            if (this.dataArray.length > 0) {
                await prisma.rawOrder.createMany({
                    data: this.dataArray,
                });
            }
            console.log(`${this.label} data has been processed!`);
        },
    };

    const productsStruct: CsvData<RawProduct> = {
        url: PRODUCTSURL,
        label: "Products",
        dataArray: [],
        stepFunc: async function (row: Papa.ParseStepResult<unknown>, parser: Papa.Parser) {
            if (!parseRawObject(row.data)) {
                return
            }

            this.dataArray.push({
                product_id: row.data?.product_id ?? "",
                product_category_name: row.data?.product_category_name ?? null,
                product_name_lenght: typeof row.data?.product_name_lenght === "number" ?
                    row.data.product_name_lenght : null,
                product_description_lenght: typeof row.data?.product_description_lenght === "number" ?
                    row.data.product_description_lenght : null,
                product_photos_qty: typeof row.data?.product_photos_qty === "number" ?
                    row.data.product_photos_qty : null,
                product_weight_g: typeof row.data?.product_weight_g === "number" ?
                    row.data.product_weight_g : null,
                product_length_cm: typeof row.data?.product_length_cm === "number" ?
                    row.data.product_length_cm : null,
                product_height_cm: typeof row.data?.product_height_cm === "number" ? 
                    row.data.product_height_cm : null,
                product_width_cm: typeof row.data?.product_width_cm === "number" ?
                    row.data.product_width_cm : null
            });

            if (this.dataArray.length >= 1000) {
                parser.pause();

                await prisma.rawProduct.createMany({
                    data: this.dataArray,
                })
                
                this.dataArray = [];
                parser.resume();
            }
        },
        completeFunc: async function() {
            if (this.dataArray.length > 0) {
                await prisma.rawProduct.createMany({
                    data: this.dataArray,
                })
            }
            console.log(`${this.label} data has been processed!`);
        },
    };

    const sellersStruct: CsvData<RawSeller> = {
        url: SELLERSURL,
        label: "Sellers",
        dataArray: [],
        stepFunc: async function (row: Papa.ParseStepResult<unknown>, parser: Papa.Parser) {
            if (!parseRawObject(row.data)) {
                return
            }

            this.dataArray.push({
                seller_id: row.data?.seller_id ?? "",
                seller_zip_code_prefix: row.data?.seller_zip_code_prefix ?? null,
                seller_city: typeof row.data?.seller_city === "string" ?
                    row.data.seller_city : null,
                seller_state: row.data?.seller_state ?? null
            });

            if (this.dataArray.length >= 1000) {
                parser.pause();

                await prisma.rawSeller.createMany({
                    data: this.dataArray,
                })

                this.dataArray = [];
                parser.resume();
            }
        },
        completeFunc: async function() {
            if (this.dataArray.length > 0) {
                await prisma.rawSeller.createMany({
                    data: this.dataArray,
                })
            }
            console.log(`${this.label} data has been processed!`);
        },
    };

    const categNamesStruct: CsvData<RawCategName> = {
        url: CATNAMEURL,
        dataArray: [],
        label: "Category names",
        stepFunc: async function (row: Papa.ParseStepResult<unknown>, parser: Papa.Parser) {
            if (!parseRawObject(row.data)) {
                return;
            }

            this.dataArray.push({
                product_category_name: row.data?.product_category_name ?? null,
                product_category_name_english: row.data?.product_category_name_english ?? null
            });

            if (this.dataArray.length >= 1000) {
                parser.pause();

                await prisma.rawCategName.createMany({
                    data: this.dataArray,
                })

                this.dataArray = [];
                parser.resume();
            }
        },
        completeFunc: async function() {
            if (this.dataArray.length > 0) {
                await prisma.rawCategName.createMany({
                    data: this.dataArray,
                });
            }
            console.log(`${this.label} data has been processed!`);
        },
    };

    return [
        customerStruct,
        itemOrderStruct,
        orderPaymentStruct,
        orderReviewsStruct,
        ordersStruct,
        productsStruct,
        sellersStruct,
        categNamesStruct,
    ]
};

const buildRawDB = async () => {
    const csvDataArr = buildCsvLayout();
    if (!await checkRawDatabase()) {
        console.log("Raw database already has the CSV information loaded!")
        return
    }

    console.log("Starting to iterate!")
    for (const dataStruct of csvDataArr) {
        await fetchCSVPaparse(dataStruct);
    }
};

await buildRawDB();