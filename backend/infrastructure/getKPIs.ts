import { prisma } from "../prisma/prismaClient";

const getKPIOrders = async () : Promise<number> => {
    return await prisma.goldDimOrder.count();
};

const getKPI_AOV = async () : Promise<number> => {
    const totalOrders = await prisma.goldDimOrder.count();
    if (totalOrders === 0) return 0;

    const result = await prisma.goldFactSales.aggregate({
        _sum: {
            payment_value_allocated: true,
        }
    });

    return (result._sum.payment_value_allocated || 0) / totalOrders;
};

console.log(await getKPI_AOV());