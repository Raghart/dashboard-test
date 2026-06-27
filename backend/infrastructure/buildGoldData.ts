import { prisma } from "../prisma/prismaClient";

const checkGoldDatabase = async () : Promise<boolean> => {
    const dimCount = await prisma.goldDimCustomer.count();
    return dimCount === 0;
};

const buildGoldLayer = async () => {
    if (!await checkGoldDatabase()) {
        console.log("Gold layer already has data in it!")
        return
    }

    const buildGoldFuncs = []; 
};

await buildGoldLayer();