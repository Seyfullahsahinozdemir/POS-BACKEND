import {
  addSecurityRole,
  ensureDatabaseExists,
  insertDesignDocs,
  setupReplication,
} from "./services/common.db";
import {
  companyNanoInstances,
  masterNanoInstance,
} from "./services/db.service";
import {
  validationDesignDoc,
  filterDesignDoc,
} from "./design_documents/orders.design.doc";

const dbName = "orders";
const designDocs = [validationDesignDoc, filterDesignDoc];

export const initOrdersDB = async () => {
  try {
    await ensureDatabaseExists(masterNanoInstance, dbName);
    await addSecurityRole(masterNanoInstance.db.use(dbName), "waiter");
    await insertDesignDocs(masterNanoInstance.db.use(dbName), designDocs);

    for (const companyInstance of Object.values(companyNanoInstances)) {
      await ensureDatabaseExists(companyInstance, dbName);
      await insertDesignDocs(companyInstance.db.use(dbName), designDocs);
      await addSecurityRole(companyInstance.db.use(dbName), "waiter");
    }

    // Setup replication
    await setupReplication(masterNanoInstance, companyNanoInstances, dbName);
  } catch (err) {
    console.error("Error initializing orders database:", err);
  }
};

export default masterNanoInstance.db.use(dbName);
