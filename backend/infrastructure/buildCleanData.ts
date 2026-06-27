import { isCleanCustomer, isCleanSeller, isString } from "../domain/typeCheckers";
import { CleanCategName, CleanCustomer, CleanSeller } from "../prisma/client/client";
import { prisma } from "../prisma/prismaClient";

const checkCleanDatabase = async () : Promise<boolean> => {
    const count = await prisma.cleanSeller.count();
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
    
};

const buildCleanLayer = async () => {
    if (!await checkCleanDatabase()) {
        console.log("The clean table already has data in it!");
        return;
    }

    const buildCleanFuncs = [
        //buildCleanCategNames,
        //buildCleanCustomers,
        buildCleanSellers,
    ];

    for (const cleanFunc of buildCleanFuncs) {
        await cleanFunc();
    }
};

await buildCleanLayer()