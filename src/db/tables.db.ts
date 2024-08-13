import {
  masterNanoInstance,
  companyNanoInstances,
} from "./services/db.service";
import {
  validationDesignDoc,
  filterDesignDoc,
} from "./design_documents/tables.design.doc";
import {
  ensureDatabaseExists,
  addSecurityRole,
  insertDesignDocs,
  insertDocuments,
  setupReplication,
} from "./services/common.db";

const dbName = "tables";

// Function to initialize the tables database and setup replication
export const initTablesDB = async () => {
  try {
    // Ensure databases exist
    await ensureDatabaseExists(masterNanoInstance, dbName);
    for (const companyInstance of Object.values(companyNanoInstances)) {
      await ensureDatabaseExists(companyInstance, dbName);
    }

    const masterDb = masterNanoInstance.db.use(dbName);

    // Add waiter as member access role
    await addSecurityRole(masterDb, "user");

    // Insert design docs for master
    await insertDesignDocs(masterDb, [validationDesignDoc, filterDesignDoc]);

    // Insert design docs for each company database
    for (const companyInstance of Object.values(companyNanoInstances)) {
      const companyDb = companyInstance.db.use(dbName);
      await insertDesignDocs(companyDb, [validationDesignDoc, filterDesignDoc]);
      await addSecurityRole(companyInstance.db.use(dbName), "user");
    }
    const tables = [
      // Company 1
      {
        id: "place_1_table_1",
        type: "table",
        table_number: 1,
        status: "available",
        place_id: "place_1",
        company_id: 1,
        orders: [],
      },
      {
        id: "place_1_table_2",
        type: "table",
        table_number: 2,
        status: "available",
        place_id: "place_1",
        company_id: 1,
        orders: [],
      },
      {
        id: "place_1_table_3",
        type: "table",
        table_number: 3,
        status: "available",
        place_id: "place_1",
        company_id: 1,
        orders: [],
      },
      {
        id: "place_1_table_4",
        type: "table",
        table_number: 4,
        status: "available",
        place_id: "place_1",
        company_id: 1,
        orders: [],
      },
      {
        id: "place_1_table_5",
        type: "table",
        table_number: 5,
        status: "available",
        place_id: "place_1",
        company_id: 1,
        orders: [],
      },
      {
        id: "place_2_table_1",
        type: "table",
        table_number: 1,
        status: "available",
        place_id: "place_2",
        company_id: 1,
        orders: [],
      },
      {
        id: "place_2_table_2",
        type: "table",
        table_number: 2,
        status: "available",
        place_id: "place_2",
        company_id: 1,
        orders: [],
      },
      {
        id: "place_2_table_3",
        type: "table",
        table_number: 3,
        status: "available",
        place_id: "place_2",
        company_id: 1,
        orders: [],
      },
      {
        id: "place_2_table_4",
        type: "table",
        table_number: 4,
        status: "available",
        place_id: "place_2",
        company_id: 1,
        orders: [],
      },
      {
        id: "place_2_table_5",
        type: "table",
        table_number: 5,
        status: "available",
        place_id: "place_2",
        company_id: 1,
        orders: [],
      },
      {
        id: "place_3_table_1",
        type: "table",
        table_number: 1,
        status: "available",
        place_id: "place_3",
        company_id: 1,
        orders: [],
      },
      {
        id: "place_3_table_2",
        type: "table",
        table_number: 2,
        status: "available",
        place_id: "place_3",
        company_id: 1,
        orders: [],
      },
      {
        id: "place_3_table_3",
        type: "table",
        table_number: 3,
        status: "available",
        place_id: "place_3",
        company_id: 1,
        orders: [],
      },
      {
        id: "place_3_table_4",
        type: "table",
        table_number: 4,
        status: "available",
        place_id: "place_3",
        company_id: 1,
        orders: [],
      },
      {
        id: "place_3_table_5",
        type: "table",
        table_number: 5,
        status: "available",
        place_id: "place_3",
        company_id: 1,
        orders: [],
      },
      // Company 2
      {
        id: "place_4_table_1",
        type: "table",
        table_number: 1,
        status: "available",
        place_id: "place_4",
        company_id: 2,
        orders: [],
      },
      {
        id: "place_4_table_2",
        type: "table",
        table_number: 2,
        status: "available",
        place_id: "place_4",
        company_id: 2,
        orders: [],
      },
      {
        id: "place_4_table_3",
        type: "table",
        table_number: 3,
        status: "available",
        place_id: "place_4",
        company_id: 2,
        orders: [],
      },
      {
        id: "place_4_table_4",
        type: "table",
        table_number: 4,
        status: "available",
        place_id: "place_4",
        company_id: 2,
        orders: [],
      },
      {
        id: "place_4_table_5",
        type: "table",
        table_number: 5,
        status: "available",
        place_id: "place_4",
        company_id: 2,
        orders: [],
      },
      {
        id: "place_5_table_1",
        type: "table",
        table_number: 1,
        status: "available",
        place_id: "place_5",
        company_id: 2,
        orders: [],
      },
      {
        id: "place_5_table_2",
        type: "table",
        table_number: 2,
        status: "available",
        place_id: "place_5",
        company_id: 2,
        orders: [],
      },
      {
        id: "place_5_table_3",
        type: "table",
        table_number: 3,
        status: "available",
        place_id: "place_5",
        company_id: 2,
        orders: [],
      },
      {
        id: "place_5_table_4",
        type: "table",
        table_number: 4,
        status: "available",
        place_id: "place_5",
        company_id: 2,
        orders: [],
      },
      {
        id: "place_5_table_5",
        type: "table",
        table_number: 5,
        status: "available",
        place_id: "place_5",
        company_id: 2,
        orders: [],
      },
      {
        id: "place_6_table_1",
        type: "table",
        table_number: 1,
        status: "available",
        place_id: "place_6",
        company_id: 2,
        orders: [],
      },
      {
        id: "place_6_table_2",
        type: "table",
        table_number: 2,
        status: "available",
        place_id: "place_6",
        company_id: 2,
        orders: [],
      },
      {
        id: "place_6_table_3",
        type: "table",
        table_number: 3,
        status: "available",
        place_id: "place_6",
        company_id: 2,
        orders: [],
      },
      {
        id: "place_6_table_4",
        type: "table",
        table_number: 4,
        status: "available",
        place_id: "place_6",
        company_id: 2,
        orders: [],
      },
      {
        id: "place_6_table_5",
        type: "table",
        table_number: 5,
        status: "available",
        place_id: "place_6",
        company_id: 2,
        orders: [],
      },
    ];

    await insertDocuments(masterDb, tables);

    // Setup replication
    await setupReplication(masterNanoInstance, companyNanoInstances, dbName);
  } catch (err) {
    console.error(
      "Error initializing tables database and setting up replication:",
      err
    );
  }
};

export default masterNanoInstance.db.use(dbName);
