import { ensureDatabaseExists } from "./services/common.db";
import {
  companyNanoInstances,
  masterNanoInstance,
} from "./services/db.service";

const dbName = "_users";

export const initUsersDB = async () => {
  try {
    await ensureDatabaseExists(masterNanoInstance, dbName);

    for (const companyInstance of Object.values(companyNanoInstances)) {
      await ensureDatabaseExists(companyInstance, dbName);
    }
  } catch (err) {
    console.error("Error initializing _users database:", err);
  }
};

export default masterNanoInstance.db.use(dbName);
