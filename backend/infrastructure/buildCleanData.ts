import { prisma } from "../prisma/prismaClient";

const checkCleanDatabase = async () : Promise<boolean> => {
    const count = await prisma.cleanCategName.count();
    return count === 0;
};

console.log(await checkCleanDatabase())