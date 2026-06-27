import { isString } from "../domain/typeCheckers";
import { CleanCategName } from "../prisma/client/client";
import { prisma } from "../prisma/prismaClient";

const checkCleanDatabase = async () : Promise<boolean> => {
    const count = await prisma.cleanCategName.count();
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

const buildCleanLayer = async () => {
    const isClean = await checkCleanDatabase()
    if (!isClean) {
        console.log("clean table already has data in it!");
        return;
    }

    const buildCleanFuncs = [
        buildCleanCategNames,
    ];

    for (const cleanFunc of buildCleanFuncs) {
        await cleanFunc();
    }
};

await buildCleanLayer()