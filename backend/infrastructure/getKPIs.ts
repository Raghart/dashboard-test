import { prisma } from "../prisma/prismaClient";

const getKPIOrders = async () => {
    return await prisma.goldDimOrder.count();
};