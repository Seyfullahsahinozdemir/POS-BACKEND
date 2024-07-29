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

    // add waiter as member access role.
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

    // insert products design doc
    await db.insert(designDoc);

    // Add product documents
    const products = [
      {
        id: "product_1",
        type: "product",
        name: "Coca Cola",
        price: 5.0,
        product_type_id: "product_type_1",
        product_type: "beverages",
        place_id: "place_1",
      },
      {
        id: "product_2",
        type: "product",
        name: "Pepsi",
        price: 5.0,
        product_type_id: "product_type_1",
        product_type: "beverages",
        place_id: "place_1",
      },
      {
        id: "product_3",
        type: "product",
        name: "Orange Juice",
        price: 6.0,
        product_type_id: "product_type_1",
        product_type: "beverages",
        place_id: "place_1",
      },
      {
        id: "product_4",
        type: "product",
        name: "Lemonade",
        price: 4.5,
        product_type_id: "product_type_1",
        product_type: "beverages",
        place_id: "place_1",
      },
      {
        id: "product_5",
        type: "product",
        name: "Mineral Water",
        price: 2.0,
        product_type_id: "product_type_1",
        product_type: "beverages",
        place_id: "place_1",
      },
      {
        id: "product_6",
        type: "product",
        name: "Beer",
        price: 7.0,
        product_type_id: "product_type_2",
        product_type: "snacks",
        place_id: "place_2",
      },
      {
        id: "product_7",
        type: "product",
        name: "Nachos",
        price: 8.0,
        product_type_id: "product_type_2",
        product_type: "snacks",
        place_id: "place_2",
      },
      {
        id: "product_8",
        type: "product",
        name: "Chicken Wings",
        price: 10.0,
        product_type_id: "product_type_2",
        product_type: "snacks",
        place_id: "place_2",
      },
      {
        id: "product_9",
        type: "product",
        name: "French Fries",
        price: 4.0,
        product_type_id: "product_type_2",
        product_type: "snacks",
        place_id: "place_2",
      },
      {
        id: "product_10",
        type: "product",
        name: "Cheese Sticks",
        price: 6.0,
        product_type_id: "product_type_2",
        product_type: "snacks",
        place_id: "place_2",
      },
      {
        id: "product_11",
        type: "product",
        name: "Margarita",
        price: 9.0,
        product_type_id: "product_type_3",
        product_type: "drinks",
        place_id: "place_3",
      },
      {
        id: "product_12",
        type: "product",
        name: "Mojito",
        price: 8.5,
        product_type_id: "product_type_3",
        product_type: "drinks",
        place_id: "place_3",
      },
      {
        id: "product_13",
        type: "product",
        name: "Pina Colada",
        price: 9.0,
        product_type_id: "product_type_3",
        product_type: "drinks",
        place_id: "place_3",
      },
      {
        id: "product_14",
        type: "product",
        name: "Tequila Sunrise",
        price: 9.5,
        product_type_id: "product_type_3",
        product_type: "drinks",
        place_id: "place_3",
      },
      {
        id: "product_15",
        type: "product",
        name: "Mai Tai",
        price: 8.0,
        product_type_id: "product_type_3",
        product_type: "drinks",
        place_id: "place_3",
      },
      {
        id: "product_16",
        type: "product",
        name: "Espresso",
        price: 3.0,
        product_type_id: "product_type_1",
        product_type: "beverages",
        place_id: "place_1",
      },
      {
        id: "product_17",
        type: "product",
        name: "Cappuccino",
        price: 3.5,
        product_type_id: "product_type_1",
        product_type: "beverages",
        place_id: "place_1",
      },
      {
        id: "product_18",
        type: "product",
        name: "Latte",
        price: 4.0,
        product_type_id: "product_type_1",
        product_type: "beverages",
        place_id: "place_1",
      },
      {
        id: "product_19",
        type: "product",
        name: "Iced Coffee",
        price: 4.5,
        product_type_id: "product_type_1",
        product_type: "beverages",
        place_id: "place_1",
      },
      {
        id: "product_20",
        type: "product",
        name: "Macchiato",
        price: 4.0,
        product_type_id: "product_type_1",
        product_type: "beverages",
        place_id: "place_1",
      },
    ];

    for (const product of products) {
      await db.insert(product as any);
    }

    console.log("Products added successfully");
  } catch (err) {
    console.error("Error creating design document or adding products:", err);
  }
};

export default nanoInstance.db.use(dbName);
