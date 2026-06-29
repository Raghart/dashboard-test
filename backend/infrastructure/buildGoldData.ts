import { FactSalesData } from "../domain/csvTypes";
import { isCleanOrder, isCleanOrderPayment, isOrder } from "../domain/typeCheckers";
import { CleanOrder, CleanOrderPayment, GoldDimCustomer, GoldDimDate, GoldDimOrder, GoldDimProduct, GoldFactSales } from "../prisma/client/client";
import { prisma } from "../prisma/prismaClient";

const checkGoldDatabase = async () : Promise<boolean> => {
    const dimCount = await prisma.goldFactSales.count();
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

        if (goldDates.length >= 1000) {
            await prisma.goldDimDate.createMany({
                data: goldDates,
            });

            goldDates = [];
        }
    }
    
    if (goldDates.length > 0) {
        await prisma.goldDimDate.createMany({
            data: goldDates,
        });
    };
    console.log("The Gold Dimension for Dates has been sucessfully processed!");
}

const buildDimDateID = (date: Date) : number => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return parseInt(`${year}${month}${day}`);
};

const buildTotalPaymentMap = async () : Promise<Map<string,number>> => {
    const orderPayments = await prisma.cleanOrderPayment.findMany();
    const totalPaymentMap = new Map<string, number>();

    for (const orderPayment of orderPayments) {
        const currentTotal = totalPaymentMap.get(orderPayment.order_id) || 0;
        totalPaymentMap.set(orderPayment.order_id, currentTotal + orderPayment.payment_value);
    }

    return totalPaymentMap;
};

const buildTotalValuesMap = async () : Promise<Map<string,number>> => {
    const itemOrders = await prisma.cleanItemOrder.findMany();

    const itemsTotalValuesMap = new Map<string,number>();

    for (const itemOrder of itemOrders) {
        const currentTotal = itemsTotalValuesMap.get(itemOrder.order_id) || 0;
        itemsTotalValuesMap.set(itemOrder.order_id, currentTotal + 
            (itemOrder.price + itemOrder.freight_value));
    };

    return itemsTotalValuesMap;
}

const buildGoldFactSales = async () => {
    const ordersData = await prisma.cleanOrder.findMany();
    const orderMap = new Map(ordersData.map(obj => [obj.order_id, obj]))
    const itemOrders = await prisma.cleanItemOrder.findMany();
    const totalPaymentMap = await buildTotalPaymentMap();
    const itemsTotalValuesMap = await buildTotalValuesMap();

    let goldFactSales: FactSalesData[] = [];
    for (const itemOrder of itemOrders) {
        const order = orderMap.get(itemOrder.order_id)
        if (!isCleanOrder(order)) {
            throw new Error(`order wasn't found: ${order}`)
        }

        const totalPayment = totalPaymentMap.get(itemOrder.order_id) || 0;
        const itemValues = itemsTotalValuesMap.get(itemOrder.order_id) || 0;
        const payment_allocated = totalPayment * ((itemOrder.price + itemOrder.freight_value) / itemValues);

        goldFactSales.push({
            date_id: buildDimDateID(order.order_purchase_timestamp),
            order_id: itemOrder.order_id,
            customer_id: order.customer_id,
            product_id: itemOrder.product_id,
            freight_value: itemOrder.freight_value,
            item_price: itemOrder.price,
            payment_value_allocated: payment_allocated,
            is_delivered: order.order_status === "delivered",
            is_canceled: order.order_status === "canceled",
            is_on_time: order.order_status === "delivered" && 
                order.order_delivered_customer_date <= order.order_estimated_delivery_date,
        });
        
        if (goldFactSales.length >= 1000) {
            await prisma.goldFactSales.createMany({
                data: goldFactSales,
            });
            goldFactSales = []
        }
    };
    if (goldFactSales.length > 0) {
        await prisma.goldFactSales.createMany({
            data: goldFactSales,
        });
    };
    console.log("The Gold Dimension for Dates has been sucessfully processed!");
};

const buildGoldLayer = async () => {
    if (!await checkGoldDatabase()) {
        console.log("Gold layer already has data in it!")
        return
    }

    const buildGoldFuncs = [
        //buildGoldCustomers,
        //buildGoldProducts,
        //buildGoldOrders,
        //buildGoldDates,
        buildGoldFactSales,
    ];

    for (const buildFunc of buildGoldFuncs) {
        await buildFunc();
    }
};

await buildGoldLayer();