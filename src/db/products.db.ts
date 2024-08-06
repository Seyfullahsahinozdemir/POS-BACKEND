import {
  masterNanoInstance,
  companyNanoInstances,
} from "./services/db.service";
import {
  filterDesignDoc,
  validationDesignDoc,
} from "./design_documents/products.design.doc";
import {
  ensureDatabaseExists,
  addSecurityRole,
  insertDesignDocs,
  insertDocuments,
  setupReplication,
} from "./services/common.db";

const dbName = "products";

export const initProductsDB = async () => {
  try {
    // Ensure databases exist
    await ensureDatabaseExists(masterNanoInstance, dbName);
    for (const companyInstance of Object.values(companyNanoInstances)) {
      await ensureDatabaseExists(companyInstance, dbName);
    }

    const masterDb = masterNanoInstance.db.use(dbName);

    // Add waiter as member access role
    await addSecurityRole(masterDb, "waiter");

    // Insert design docs for master
    await insertDesignDocs(masterDb, [validationDesignDoc, filterDesignDoc]);

    // Insert design docs for each company database
    for (const companyInstance of Object.values(companyNanoInstances)) {
      const companyDb = companyInstance.db.use(dbName);
      await insertDesignDocs(companyDb, [validationDesignDoc, filterDesignDoc]);
      await addSecurityRole(companyInstance.db.use(dbName), "waiter");
    }

    // Add product documents
    const products = [
      // Products for company 1
      {
        id: "product_1",
        type: "product",
        name: "Coca Cola",
        price: 5.0,
        product_type_id: "product_type_1",
        product_type: "beverages",
        place_id: "place_1",
        company_id: 1,
      },
      {
        id: "product_2",
        type: "product",
        name: "Pepsi",
        price: 5.0,
        product_type_id: "product_type_1",
        product_type: "beverages",
        place_id: "place_1",
        company_id: 1,
      },
      {
        id: "product_3",
        type: "product",
        name: "Orange Juice",
        price: 6.0,
        product_type_id: "product_type_1",
        product_type: "beverages",
        place_id: "place_2",
        company_id: 1,
      },
      {
        id: "product_4",
        type: "product",
        name: "Lemonade",
        price: 4.5,
        product_type_id: "product_type_1",
        product_type: "beverages",
        place_id: "place_2",
        company_id: 1,
      },
      {
        id: "product_5",
        type: "product",
        name: "Mineral Water",
        price: 2.0,
        product_type_id: "product_type_1",
        product_type: "beverages",
        place_id: "place_3",
        company_id: 1,
      },
      {
        id: "product_6",
        type: "product",
        name: "Espresso",
        price: 3.0,
        product_type_id: "product_type_1",
        product_type: "beverages",
        place_id: "place_3",
        company_id: 1,
      },
      {
        id: "product_17",
        type: "product",
        name: "Green Tea",
        price: 4.0,
        product_type_id: "product_type_1",
        product_type: "beverages",
        place_id: "place_1",
        company_id: 1,
      },
      {
        id: "product_18",
        type: "product",
        name: "Latte",
        price: 4.5,
        product_type_id: "product_type_1",
        product_type: "beverages",
        place_id: "place_2",
        company_id: 1,
      },
      {
        id: "product_19",
        type: "product",
        name: "Americano",
        price: 3.5,
        product_type_id: "product_type_1",
        product_type: "beverages",
        place_id: "place_3",
        company_id: 1,
      },
      {
        id: "product_20",
        type: "product",
        name: "Cappuccino",
        price: 4.0,
        product_type_id: "product_type_1",
        product_type: "beverages",
        place_id: "place_1",
        company_id: 1,
      },
      {
        id: "product_21",
        type: "product",
        name: "Hot Chocolate",
        price: 5.0,
        product_type_id: "product_type_1",
        product_type: "beverages",
        place_id: "place_2",
        company_id: 1,
      },
      {
        id: "product_22",
        type: "product",
        name: "Iced Coffee",
        price: 4.0,
        product_type_id: "product_type_1",
        product_type: "beverages",
        place_id: "place_3",
        company_id: 1,
      },
      // Products for company 2
      {
        id: "product_7",
        type: "product",
        name: "Beer",
        price: 7.0,
        product_type_id: "product_type_2",
        product_type: "snacks",
        place_id: "place_4",
        company_id: 2,
      },
      {
        id: "product_8",
        type: "product",
        name: "Nachos",
        price: 8.0,
        product_type_id: "product_type_2",
        product_type: "snacks",
        place_id: "place_4",
        company_id: 2,
      },
      {
        id: "product_9",
        type: "product",
        name: "Chicken Wings",
        price: 10.0,
        product_type_id: "product_type_2",
        product_type: "snacks",
        place_id: "place_5",
        company_id: 2,
      },
      {
        id: "product_10",
        type: "product",
        name: "French Fries",
        price: 4.0,
        product_type_id: "product_type_2",
        product_type: "snacks",
        place_id: "place_5",
        company_id: 2,
      },
      {
        id: "product_11",
        type: "product",
        name: "Cheese Sticks",
        price: 6.0,
        product_type_id: "product_type_2",
        product_type: "snacks",
        place_id: "place_6",
        company_id: 2,
      },
      {
        id: "product_12",
        type: "product",
        name: "Margarita",
        price: 9.0,
        product_type_id: "product_type_3",
        product_type: "drinks",
        place_id: "place_6",
        company_id: 2,
      },
      {
        id: "product_13",
        type: "product",
        name: "Mojito",
        price: 8.5,
        product_type_id: "product_type_3",
        product_type: "drinks",
        place_id: "place_4",
        company_id: 2,
      },
      {
        id: "product_14",
        type: "product",
        name: "Pina Colada",
        price: 9.0,
        product_type_id: "product_type_3",
        product_type: "drinks",
        place_id: "place_5",
        company_id: 2,
      },
      {
        id: "product_15",
        type: "product",
        name: "Tequila Sunrise",
        price: 9.5,
        product_type_id: "product_type_3",
        product_type: "drinks",
        place_id: "place_6",
        company_id: 2,
      },
      {
        id: "product_16",
        type: "product",
        name: "Mai Tai",
        price: 8.0,
        product_type_id: "product_type_3",
        product_type: "drinks",
        place_id: "place_4",
        company_id: 2,
      },
      {
        id: "product_23",
        type: "product",
        name: "Gin Tonic",
        price: 8.0,
        product_type_id: "product_type_3",
        product_type: "drinks",
        place_id: "place_4",
        company_id: 2,
      },
      {
        id: "product_24",
        type: "product",
        name: "Whiskey Sour",
        price: 9.0,
        product_type_id: "product_type_3",
        product_type: "drinks",
        place_id: "place_5",
        company_id: 2,
      },
      {
        id: "product_25",
        type: "product",
        name: "Long Island Iced Tea",
        price: 10.0,
        product_type_id: "product_type_3",
        product_type: "drinks",
        place_id: "place_6",
        company_id: 2,
      },
      {
        id: "product_26",
        type: "product",
        name: "Old Fashioned",
        price: 8.5,
        product_type_id: "product_type_3",
        product_type: "drinks",
        place_id: "place_4",
        company_id: 2,
      },
      {
        id: "product_27",
        type: "product",
        name: "Martini",
        price: 9.5,
        product_type_id: "product_type_3",
        product_type: "drinks",
        place_id: "place_5",
        company_id: 2,
      },
      {
        id: "product_28",
        type: "product",
        name: "Bloody Mary",
        price: 7.5,
        product_type_id: "product_type_3",
        product_type: "drinks",
        place_id: "place_6",
        company_id: 2,
      },
    ];

    await insertDocuments(masterDb, products);

    // Setup replication
    await setupReplication(masterNanoInstance, companyNanoInstances, dbName);
  } catch (err) {
    console.error("Error creating design document or adding products:", err);
  }
};

export default masterNanoInstance.db.use(dbName);
