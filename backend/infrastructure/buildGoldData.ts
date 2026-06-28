import { GoldDimCustomer, GoldDimDate, GoldDimOrder, GoldDimProduct } from "../prisma/client/client";
import { prisma } from "../prisma/prismaClient";

const checkGoldDatabase = async () : Promise<boolean> => {
    const dimCount = await prisma.goldDimDate.count();
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

const buildGoldOrders = async () => {
    const cleanOrders = await prisma.cleanOrder.findMany();
    let goldOrders: GoldDimOrder[] = [];

    for (const order of cleanOrders) {
        goldOrders.push({
            order_id: order.order_id,
            order_status: order.order_status,
            order_purchase_timestamp: order.order_purchase_timestamp,
            order_approved_at: order.order_approved_at,
            order_delivered_carrier_date: order.order_delivered_carrier_date,
            order_delivered_customer_date: order.order_delivered_customer_date,
            order_estimated_delivery_date: order.order_estimated_delivery_date,
        });

        if (goldOrders.length >= 1000) {
            await prisma.goldDimOrder.createMany({
                data: goldOrders,
            })
            goldOrders = [];
        };
    };

    if (goldOrders.length > 0) {
        await prisma.goldDimOrder.createMany({
            data: goldOrders,
        });
    };

    console.log("The Gold Dimension for Orders has been sucessfully processed!");
};

const buildGoldDates = async () => {
    let goldDates: GoldDimDate[] = [];
    const startingDate = new Date("2015-01-01");
    const endingDate = new Date("2025-12-31");
    while (startingDate <= endingDate) {
        const day = startingDate.getDate().toString().padStart(2, "0");
        const month = startingDate.getMonth() + 1;
        const year = startingDate.getFullYear();

        const dateID = parseInt(`${year}${month}${day}`);
        
        goldDates.push({
            date_id: dateID,
            date: `${year}-${month}-${day}`,
            year: year,
            month: month,
            weekday: startingDate.toLocaleDateString("es-ES", { weekday: "long" }),
        })
        
        startingDate.setDate(startingDate.getDate() + 1);
    }
    console.log("The Gold Dimension for Dates has been sucessfully processed!");
}

const buildGoldLayer = async () => {
    if (!await checkGoldDatabase()) {
        console.log("Gold layer already has data in it!")
        return
    }

    const buildGoldFuncs = [
        //buildGoldCustomers,
        //buildGoldProducts,
        //buildGoldOrders,
        buildGoldDates,
    ];

    for (const buildFunc of buildGoldFuncs) {
        await buildFunc();
    }
};

await buildGoldLayer();