import nanoInstance from "./db.service";
import { designDoc } from "./design_documents/products.design.doc";

const dbName = "products";

export const initProductsDB = async () => {
  try {
    const dbList = await nanoInstance.db.list();
    if (dbList.includes(dbName)) {
      return;
    }

    await nanoInstance.db.create(dbName);

    const db = nanoInstance.db.use(dbName);

    // add waiter as member access role
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

    // insert product design doc
    await db.insert(designDoc);

    // Define and add 20 restaurant food items
    const products = [
      {
        id: "product_1",
        type: "product",
        name: "Cheeseburger",
        price: 12.99,
        category: "Burgers",
        stock: 100,
      },
      {
        id: "product_2",
        type: "product",
        name: "Margherita Pizza",
        price: 14.99,
        category: "Pizzas",
        stock: 80,
      },
      {
        id: "product_3",
        type: "product",
        name: "Caesar Salad",
        price: 10.99,
        category: "Salads",
        stock: 60,
      },
      {
        id: "product_4",
        type: "product",
        name: "Spaghetti Carbonara",
        price: 16.99,
        category: "Pasta",
        stock: 70,
      },
      {
        id: "product_5",
        type: "product",
        name: "Grilled Chicken Sandwich",
        price: 11.99,
        category: "Sandwiches",
        stock: 90,
      },
      {
        id: "product_6",
        type: "product",
        name: "Fish Tacos",
        price: 13.99,
        category: "Tacos",
        stock: 75,
      },
      {
        id: "product_7",
        type: "product",
        name: "Buffalo Wings",
        price: 9.99,
        category: "Appetizers",
        stock: 85,
      },
      {
        id: "product_8",
        type: "product",
        name: "Beef Stroganoff",
        price: 18.99,
        category: "Entrees",
        stock: 40,
      },
      {
        id: "product_9",
        type: "product",
        name: "Vegetable Stir Fry",
        price: 15.99,
        category: "Vegetarian",
        stock: 50,
      },
      {
        id: "product_10",
        type: "product",
        name: "Pancakes",
        price: 8.99,
        category: "Breakfast",
        stock: 100,
      },
      {
        id: "product_11",
        type: "product",
        name: "Eggs Benedict",
        price: 12.99,
        category: "Breakfast",
        stock: 65,
      },
      {
        id: "product_12",
        type: "product",
        name: "Ribeye Steak",
        price: 24.99,
        category: "Steaks",
        stock: 30,
      },
      {
        id: "product_13",
        type: "product",
        name: "Lobster Roll",
        price: 21.99,
        category: "Seafood",
        stock: 20,
      },
      {
        id: "product_14",
        type: "product",
        name: "Classic Burger",
        price: 11.99,
        category: "Burgers",
        stock: 80,
      },
      {
        id: "product_15",
        type: "product",
        name: "BBQ Ribs",
        price: 19.99,
        category: "Entrees",
        stock: 25,
      },
      {
        id: "product_16",
        type: "product",
        name: "Greek Salad",
        price: 11.99,
        category: "Salads",
        stock: 70,
      },
      {
        id: "product_17",
        type: "product",
        name: "Chicken Alfredo",
        price: 17.99,
        category: "Pasta",
        stock: 60,
      },
      {
        id: "product_18",
        type: "product",
        name: "Clam Chowder",
        price: 13.99,
        category: "Soups",
        stock: 45,
      },
      {
        id: "product_19",
        type: "product",
        name: "Tiramisu",
        price: 7.99,
        category: "Desserts",
        stock: 80,
      },
      {
        id: "product_20",
        type: "product",
        name: "Cheesecake",
        price: 6.99,
        category: "Desserts",
        stock: 90,
      },
    ];

    for (const product of products) {
      await db.insert(product as any);
    }

    console.log("Restaurant food products added successfully");
  } catch (err) {
    console.error("Error initializing products database:", err);
  }
};

export default nanoInstance.db.use(dbName);
