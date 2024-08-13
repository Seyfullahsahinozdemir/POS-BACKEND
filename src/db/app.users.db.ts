import { filterDesignDoc } from "./design_documents/app.users.design.doc";
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

const dbName = "sl-users";
const designDocs = [filterDesignDoc];

export const initAppUsersDB = async () => {
  try {
    await ensureDatabaseExists(masterNanoInstance, dbName);
    await addSecurityRole(masterNanoInstance.db.use(dbName), "user");
    await insertDesignDocs(masterNanoInstance.db.use(dbName), designDocs);

    for (const companyInstance of Object.values(companyNanoInstances)) {
      await ensureDatabaseExists(companyInstance, dbName);
      await insertDesignDocs(companyInstance.db.use(dbName), designDocs);
    }

    // Setup replication
    await setupReplication(masterNanoInstance, companyNanoInstances, dbName);
  } catch (err) {
    console.error("Error initializing sl-users database:", err);
  }
};

export default masterNanoInstance.db.use(dbName);
