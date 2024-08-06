// product_types.db.ts
import {
  masterNanoInstance,
  companyNanoInstances,
} from "./services/db.service";
import {
  validationDesignDoc,
  filterDesignDoc,
} from "./design_documents/product_types.design.doc";
import {
  ensureDatabaseExists,
  addSecurityRole,
  insertDesignDocs,
  insertDocuments,
  setupReplication,
} from "./services/common.db";

const dbName = "product_types";

export const initProductTypesDB = async () => {
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

    // Add product types documents
    const productTypes = [
      // Company 1
      {
        id: "product_type_1",
        type: "product_type",
        name: "beverages",
        place: "restaurant",
        place_id: "place_1",
        companyId: 1,
      },
      {
        id: "product_type_2",
        type: "product_type",
        name: "snacks",
        place: "restaurant",
        place_id: "place_1",
        companyId: 1,
      },
      {
        id: "product_type_3",
        type: "product_type",
        name: "desserts",
        place: "restaurant",
        place_id: "place_1",
        companyId: 1,
      },
      {
        id: "product_type_4",
        type: "product_type",
        name: "beverages",
        place: "bar",
        place_id: "place_2",
        companyId: 1,
      },
      {
        id: "product_type_5",
        type: "product_type",
        name: "snacks",
        place: "bar",
        place_id: "place_2",
        companyId: 1,
      },
      {
        id: "product_type_6",
        type: "product_type",
        name: "cocktails",
        place: "bar",
        place_id: "place_2",
        companyId: 1,
      },
      {
        id: "product_type_7",
        type: "product_type",
        name: "beverages",
        place: "pool",
        place_id: "place_3",
        companyId: 1,
      },
      {
        id: "product_type_8",
        type: "product_type",
        name: "snacks",
        place: "pool",
        place_id: "place_3",
        companyId: 1,
      },
      {
        id: "product_type_9",
        type: "product_type",
        name: "smoothies",
        place: "pool",
        place_id: "place_3",
        companyId: 1,
      },

      // Company 2
      {
        id: "product_type_10",
        type: "product_type",
        name: "beverages",
        place: "restaurant",
        place_id: "place_4",
        companyId: 2,
      },
      {
        id: "product_type_11",
        type: "product_type",
        name: "snacks",
        place: "restaurant",
        place_id: "place_4",
        companyId: 2,
      },
      {
        id: "product_type_12",
        type: "product_type",
        name: "desserts",
        place: "restaurant",
        place_id: "place_4",
        companyId: 2,
      },
      {
        id: "product_type_13",
        type: "product_type",
        name: "beverages",
        place: "bar",
        place_id: "place_5",
        companyId: 2,
      },
      {
        id: "product_type_14",
        type: "product_type",
        name: "snacks",
        place: "bar",
        place_id: "place_5",
        companyId: 2,
      },
      {
        id: "product_type_15",
        type: "product_type",
        name: "cocktails",
        place: "bar",
        place_id: "place_5",
        companyId: 2,
      },
      {
        id: "product_type_16",
        type: "product_type",
        name: "beverages",
        place: "pool",
        place_id: "place_6",
        companyId: 2,
      },
      {
        id: "product_type_17",
        type: "product_type",
        name: "snacks",
        place: "pool",
        place_id: "place_6",
        companyId: 2,
      },
      {
        id: "product_type_18",
        type: "product_type",
        name: "smoothies",
        place: "pool",
        place_id: "place_6",
        companyId: 2,
      },
    ];

    await insertDocuments(masterDb, productTypes);

    // Setup replication
    await setupReplication(masterNanoInstance, companyNanoInstances, dbName);
  } catch (err) {
    console.error("Error initializing product types database:", err);
  }
};

export default masterNanoInstance.db.use(dbName);
