import nanoInstance from "./db.service";
import { designDoc } from "./design_documents/orders.design.doc";

const dbName = "orders";

export const initOrdersDB = async () => {
  try {
    const dbList = await nanoInstance.db.list();
    if (dbList.includes(dbName)) {
      return;
    }

    await nanoInstance.db.create(dbName);

    const db = nanoInstance.db.use(dbName);

    // add admin role to security document
    let securityDoc: any;
    try {
      securityDoc = await db.get("_security");
    } catch (err: any) {
      if (err.statusCode === 404) {
        securityDoc = { members: { roles: [] } };
      } else {
        throw err;
      }
    }

    const members = securityDoc.members || {};

    if (!members.roles) {
      members.roles = [];
    }
    if (!members.roles.includes("waiter")) {
      members.roles.push("waiter");
    }

    securityDoc.members = members;

    await db.insert(securityDoc, "_security");

    // insert order design doc
    await db.insert(designDoc);

    // Define and add 10 orders
    const orders = [
      {
        id: "order_1",
        type: "order",
        user_id: "sahin",
        products: [
          { id: "prod_1", name: "Burger", price: 9.99, quantity: 1 },
          { id: "prod_2", name: "Fries", price: 3.99, quantity: 2 },
        ],
        status: "completed",
        date: "2024-07-01T12:00:00Z",
        total_price: 17.97,
        table_id: "table_1",
        venue_id: "venue_1",
      },
      {
        id: "order_2",
        type: "order",
        user_id: "fatih",
        products: [
          { id: "prod_3", name: "Pizza", price: 12.99, quantity: 1 },
          { id: "prod_4", name: "Coke", price: 2.99, quantity: 1 },
        ],
        status: "pending",
        date: "2024-07-02T13:00:00Z",
        total_price: 15.98,
        table_id: "table_2",
        venue_id: "venue_2",
      },
      {
        id: "order_3",
        type: "order",
        user_id: "talha",
        products: [
          { id: "prod_5", name: "Salad", price: 8.99, quantity: 1 },
          { id: "prod_6", name: "Water", price: 1.99, quantity: 1 },
        ],
        status: "completed",
        date: "2024-07-03T14:00:00Z",
        total_price: 10.98,
        table_id: "table_3",
        venue_id: "venue_3",
      },
      {
        id: "order_4",
        type: "order",
        user_id: "sahin",
        products: [
          { id: "prod_7", name: "Steak", price: 19.99, quantity: 1 },
          { id: "prod_8", name: "Wine", price: 6.99, quantity: 1 },
        ],
        status: "completed",
        date: "2024-07-04T15:00:00Z",
        total_price: 26.98,
        table_id: "table_4",
        venue_id: "venue_1",
      },
      {
        id: "order_5",
        type: "order",
        user_id: "fatih",
        products: [
          { id: "prod_9", name: "Pasta", price: 11.99, quantity: 1 },
          { id: "prod_10", name: "Garlic Bread", price: 4.99, quantity: 1 },
        ],
        status: "pending",
        date: "2024-07-05T16:00:00Z",
        total_price: 16.98,
        table_id: "table_5",
        venue_id: "venue_2",
      },
      {
        id: "order_6",
        type: "order",
        user_id: "talha",
        products: [
          { id: "prod_11", name: "Fish and Chips", price: 13.99, quantity: 1 },
          { id: "prod_12", name: "Beer", price: 5.99, quantity: 1 },
        ],
        status: "completed",
        date: "2024-07-06T17:00:00Z",
        total_price: 19.98,
        table_id: "table_6",
        venue_id: "venue_3",
      },
      {
        id: "order_7",
        type: "order",
        user_id: "sahin",
        products: [
          { id: "prod_13", name: "Chicken Wings", price: 10.99, quantity: 1 },
          { id: "prod_14", name: "Lemonade", price: 3.99, quantity: 1 },
        ],
        status: "completed",
        date: "2024-07-07T18:00:00Z",
        total_price: 14.98,
        table_id: "table_1",
        venue_id: "venue_1",
      },
      {
        id: "order_8",
        type: "order",
        user_id: "fatih",
        products: [
          { id: "prod_15", name: "Sushi", price: 14.99, quantity: 1 },
          { id: "prod_16", name: "Green Tea", price: 2.99, quantity: 1 },
        ],
        status: "pending",
        date: "2024-07-08T19:00:00Z",
        total_price: 17.98,
        table_id: "table_2",
        venue_id: "venue_2",
      },
      {
        id: "order_9",
        type: "order",
        user_id: "talha",
        products: [
          { id: "prod_17", name: "Ramen", price: 13.99, quantity: 1 },
          { id: "prod_18", name: "Miso Soup", price: 3.99, quantity: 1 },
        ],
        status: "completed",
        date: "2024-07-09T20:00:00Z",
        total_price: 17.98,
        table_id: "table_3",
        venue_id: "venue_3",
      },
      {
        id: "order_10",
        type: "order",
        user_id: "sahin",
        products: [
          { id: "prod_19", name: "Burrito", price: 8.99, quantity: 1 },
          { id: "prod_20", name: "Margarita", price: 7.99, quantity: 1 },
        ],
        status: "completed",
        date: "2024-07-10T21:00:00Z",
        total_price: 16.98,
        table_id: "table_4",
        venue_id: "venue_1",
      },
    ];

    for (const order of orders) {
      await db.insert(order as any);
    }

    console.log("Orders database initialized successfully.");
  } catch (err) {
    console.error("Error initializing orders database:", err);
  }
};

export default nanoInstance.use(dbName);
