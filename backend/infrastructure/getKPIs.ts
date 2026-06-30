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

const getKPI_IPO = async () => {
    const totalItems = await prisma.goldFactSales.count();
    if (totalItems === 0) return 0;
    const totalOrders = await prisma.goldDimOrder.count();
    return totalItems / totalOrders;
};

const getKPI_CancellationRate = async () => {
    const totalCancellations = await prisma.goldDimOrder.count({
        where: {
            order_status: {
                in: ["canceled", "unavailable"]
            },
        }
    });
    const totalOrders = await prisma.goldDimOrder.count();
    if (totalCancellations === 0 || totalOrders === 0) return 0; 
    return totalCancellations / totalOrders;
};

const getKPI_GMV = async () : Promise<number> => {
    const agg = await prisma.goldFactSales.aggregate({
        _sum: {
            item_price: true,
        }
    });

    return agg._sum.item_price || 0;
};

const getKPI_Reveneue = async () => {
    const agg = await prisma.goldFactSales.aggregate({
        _sum: {
            payment_value_allocated: true,
        }
    });

    return agg._sum.payment_value_allocated;
};

const getTopProductsGMV = async () => {
    const products = await prisma.goldFactSales.groupBy({
        by: ["product_id"],
        _sum: {
            item_price: true,
        },
        orderBy: {
            _sum: {
                item_price: "desc"
            },
        },
        take: 10,
    });

    return products;
};

const getTopProductsByRevenue = async () => {
    const products = await prisma.goldFactSales.groupBy({
        by: ["product_id"],
        _sum: {
            payment_value_allocated: true,
        },
        orderBy: {
            _sum: {
                payment_value_allocated: "desc"
            }
        },
        take: 10,
    });

    return products;
};

console.log(await getTopProductsByRevenue());