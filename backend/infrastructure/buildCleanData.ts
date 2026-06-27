import { isDate } from "node:util/types";
import { isCleanCustomer, isCleanOrder, isCleanProduct, isCleanSeller, isString } from "../domain/typeCheckers";
import { CleanCategName, CleanCustomer, CleanOrder, CleanProduct, CleanSeller } from "../prisma/client/client";
import { prisma } from "../prisma/prismaClient";

const checkCleanDatabase = async () : Promise<boolean> => {
    const count = await prisma.cleanOrder.count();
    const rawCount = await prisma.rawOrder.count();
    console.log(`raw count: ${rawCount}`);
    console.log(count);
    return count === 0;
};

const buildCleanCategNames = async () => {
    const categNamesArr = await prisma.rawCategName.findMany();

    const cleanCategNames: CleanCategName[] = [];
    for (const struct of categNamesArr) {
        if (!isString(struct.product_category_name) || !isString(struct.product_category_name_english)) {
            continue
        }
        
        cleanCategNames.push({
            product_category_name: struct.product_category_name.trim(),
            product_category_name_english: struct.product_category_name_english.trim(),
        });
    };

    await prisma.cleanCategName.createMany({
        data: cleanCategNames,
        skipDuplicates: true,
    })
    console.log("The Clean Category names table has been processed!");
};

const buildCleanCustomers = async () => {
    const rawCustomers = await prisma.rawCustomer.findMany();
    let cleanCustomersArr: CleanCustomer[] = [];

    for (const customerData of rawCustomers) {
        if (!isCleanCustomer(customerData)) {
            continue;
        }

        cleanCustomersArr.push({
            customer_id: customerData.customer_id.trim(),
            customer_unique_id: customerData.customer_unique_id.trim(),
            customer_zip_code_prefix: customerData.customer_zip_code_prefix,
            customer_city: customerData.customer_city.trim(),
            customer_state: customerData.customer_state.trim(),
        })

        if (cleanCustomersArr.length >= 1000) {
            await prisma.cleanCustomer.createMany({
                data: cleanCustomersArr,
            });

            cleanCustomersArr = [];  
        };
    };

    if (cleanCustomersArr.length > 0) {
        await prisma.cleanCustomer.createMany({
            data: cleanCustomersArr,
        });
    };
    console.log("The Clean Customers table has been processed!");
};

const buildCleanSellers = async () => {
    const rawSellers = await prisma.rawSeller.findMany();
    let cleanSellers: CleanSeller[] = [];

    for (const sellerData of rawSellers) {
        if (!isCleanSeller(sellerData)) {
            continue;
        }

        cleanSellers.push({
            seller_id: sellerData.seller_id,
            seller_zip_code_prefix: sellerData.seller_zip_code_prefix,
            seller_city: sellerData.seller_city,
            seller_state: sellerData.seller_state,
        });

        if (cleanSellers.length >= 1000) {
            await prisma.cleanSeller.createMany({
                data: cleanSellers,
            });
            cleanSellers = [];
        };
    }

    if (cleanSellers.length > 0) {
        await prisma.cleanSeller.createMany({
            data: cleanSellers,
        });
    };
    console.log("The Clean Sellers table has been processed!");
};

const buildCleanProducts = async () => {
    const rawProducts = await prisma.rawProduct.findMany();
    const categNames = (await prisma.cleanCategName.findMany()).map(obj => obj.product_category_name);
    let cleanProducts: CleanProduct[] = [];

    for (const productData of rawProducts) {
        if (!isCleanProduct(productData) || !categNames.includes(productData.product_category_name)) {
            continue;
        };

        cleanProducts.push({
            product_id: productData.product_id.trim(),
            product_category_name: productData.product_category_name.trim(),
            product_name_lenght: productData.product_name_lenght,
            product_description_lenght: productData.product_description_lenght,
            product_photos_qty: productData.product_photos_qty,
            product_weight_g: productData.product_weight_g,
            product_length_cm: productData.product_length_cm,
            product_height_cm: productData.product_height_cm,
            product_width_cm: productData.product_width_cm,
        });

        if (cleanProducts.length >= 1000) {
            await prisma.cleanProduct.createMany({
                data: cleanProducts,
            })
            cleanProducts = [];
        }
    };

    if (cleanProducts.length > 0) {
        await prisma.cleanProduct.createMany({
            data: cleanProducts,
        });
    };
    console.log("The Clean Products table has been processed!");
};

const buildCleanOrders = async () => {
    const rawOrders = await prisma.rawOrder.findMany();
    const customerIDS = (await prisma.cleanCustomer.findMany()).map(obj => obj.customer_id);
    let cleanOrders: CleanOrder[] = [];

    for (const orderData of rawOrders) {
        if (!isCleanOrder(orderData) || !customerIDS.includes(orderData.customer_id)) {
            continue;
        };

        cleanOrders.push({
            order_id: orderData.order_id,
            customer_id: orderData.customer_id,
            order_status: orderData.order_status,
            order_purchase_timestamp: orderData.order_purchase_timestamp,
            order_approved_at: orderData.order_approved_at,
            order_delivered_carrier_date: orderData.order_delivered_carrier_date,
            order_delivered_customer_date: orderData.order_delivered_customer_date,
            order_estimated_delivery_date: orderData.order_estimated_delivery_date,
        });

        if (cleanOrders.length >= 1000) {
            await prisma.cleanOrder.createMany({
                data: cleanOrders,
            });
            cleanOrders = [];
        }
    };

    if (cleanOrders.length > 0) {
        await prisma.cleanOrder.createMany({
            data: cleanOrders,
        });
    };
    console.log("The Clean Orders table has been processed!");
};

const buildCleanLayer = async () => {
    if (!await checkCleanDatabase()) {
        console.log("The clean table already has data in it!");
        return;
    }

    const buildCleanFuncs = [
        //buildCleanCategNames,
        //buildCleanCustomers,
        //buildCleanSellers,
        //buildCleanProducts,
        buildCleanOrders,
    ];

    for (const cleanFunc of buildCleanFuncs) {
        await cleanFunc();
    }
};

await buildCleanLayer()