import { GoldDimCustomer, GoldDimProduct } from "../prisma/client/client";
import { prisma } from "../prisma/prismaClient";

const checkGoldDatabase = async () : Promise<boolean> => {
    const dimCount = await prisma.goldDimProduct.count();
    console.log(dimCount)
    return dimCount === 0;
};

const buildGoldCustomers = async () => {
    const cleanCustomers = await prisma.cleanCustomer.findMany();
    let goldCustomers: GoldDimCustomer[] = [];

    for (const customer of cleanCustomers) {
        goldCustomers.push({
            customer_id: customer.customer_id,
            customer_city: customer.customer_city,
            customer_state: customer.customer_state,
        });

        if (goldCustomers.length >= 1000) {
            await prisma.goldDimCustomer.createMany({
                data: goldCustomers,
            });
            goldCustomers = [];
        }
    }

    if (goldCustomers.length > 0) {
        await prisma.goldDimCustomer.createMany({
            data: goldCustomers,
        });
    };

    console.log("The Gold Dimension for Customers has been sucessfully processed!");
};

const buildGoldProducts = async () => {
    const cleanProducts = await prisma.cleanProduct.findMany();
    let goldProducts: GoldDimProduct[] = [];

    for (const product of cleanProducts) {
        goldProducts.push({
            product_id: product.product_id,
            category: product.product_category_name,
        });

        if (goldProducts.length >= 1000) {
            await prisma.goldDimProduct.createMany({
                data: goldProducts,
            })
            goldProducts = [];
        }
    };

    if (goldProducts.length > 0) {
        await prisma.goldDimProduct.createMany({
            data: goldProducts,
        });
    };

    console.log("The Gold Dimension for Products has been sucessfully processed!");
};

const buildGoldLayer = async () => {
    if (!await checkGoldDatabase()) {
        console.log("Gold layer already has data in it!")
        return
    }

    const buildGoldFuncs = [
        //buildGoldCustomers,
        buildGoldProducts,
    ];

    for (const buildFunc of buildGoldFuncs) {
        await buildFunc();
    }
};

await buildGoldLayer();