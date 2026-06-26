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
            product_category_name: struct.product_category_name,
            product_category_name_english: struct.product_category_name_english,
        });
    };

    await prisma.cleanCategName.createMany({
        data: cleanCategNames
    })
    console.log("The Clean Category names table has been processed!")
};

console.log(await checkCleanDatabase())