import { isString } from "../domain/typeCheckers";
import { CleanCategName, CleanCustomer } from "../prisma/client/client";
import { prisma } from "../prisma/prismaClient";

const checkCleanDatabase = async () : Promise<boolean> => {
    const count = await prisma.cleanCustomer.count();
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
    console.log("The Clean Category names table has been processed!")
};

const buildCleanCustomers = async () => {
    const rawCustomers = await prisma.rawCustomer.findMany();
    let cleanCustomersArr: CleanCustomer[] = [];

    for (const customerData of rawCustomers) {
        
    };

    if (cleanCustomersArr.length > 0) {
        await prisma.cleanCustomer.createMany({
            data: cleanCustomersArr,
        })
    }
};

const buildCleanLayer = async () => {
    const isClean = await checkCleanDatabase()
    if (!isClean) {
        console.log("clean table already has data in it!");
        return;
    }

    const buildCleanFuncs = [
        //buildCleanCategNames,
        buildCleanCustomers,
    ];

    for (const cleanFunc of buildCleanFuncs) {
        await cleanFunc();
    }
};

await buildCleanLayer()