import nano from "nano";

const couchDBPort = process.env.COUCHDB_PORT || "5984";
const couchDBUsername = process.env.COUCHDB_USERNAME || "";
const couchDBPassword = process.env.COUCHDB_PASSWORD || "";

const nanoInstance = nano({
  url: `http://${couchDBUsername}:${couchDBPassword}@127.0.0.1:${couchDBPort}`,
  requestDefaults: {
    jar: true,
  },
});

const createDatabase = async (dbName: string) => {
  try {
    const dbList = await nanoInstance.db.list();
    if (!dbList.includes(dbName)) {
      await nanoInstance.db.create(dbName);
      console.log(`Database ${dbName} created successfully.`);
    } else {
      console.log(`Database ${dbName} already exists.`);
    }
  } catch (error: any) {
    console.error(`Error creating database ${dbName}:`, error.message);
    throw error;
  }
};

const addUserToDbAsAdmin = async (dbName: string, username: string) => {
  try {
    const db = nanoInstance.db.use(dbName);
    const dbInfo: any = await db.get("_security");

    // Initialize the admins section if it doesn't exist
    if (!dbInfo.admins) {
      dbInfo.admins = { names: [], roles: [] };
    }

    // Initialize the names array if it doesn't exist
    if (!dbInfo.admins.names) {
      dbInfo.admins.names = [];
    }

    // Add the user if not already present
    if (!dbInfo.admins.names.includes(username)) {
      dbInfo.admins.names.push(username);
    }

    await db.insert(dbInfo, "_security");
    console.log(`Permissions set for user ${username} on database ${dbName}.`);
  } catch (error: any) {
    console.error(
      `Error setting permissions for user ${username} on database ${dbName}:`,
      error.message
    );
    throw error;
  }
};

export const setupUserDatabases = async (username: string) => {
  const ordersDbName = usernameToDbName(username, "orders");
  const basketDbName = usernameToDbName(username, "basket");

  await createDatabase(ordersDbName);
  await createDatabase(basketDbName);

  await addUserToDbAsAdmin(ordersDbName, username);
  await addUserToDbAsAdmin(basketDbName, username);
};

const usernameToDbName = (name: string, prefix: string): string => {
  return `${prefix}-${Buffer.from(name).toString("hex")}`;
};

export const authenticate = async (username: string, password: string) => {
  await nanoInstance.auth(username, password);
};

const getUserDatabases = async (username: string) => {
  try {
    const hexUsername = Buffer.from(username).toString("hex");
    const dbList = await nanoInstance.db.list();
    const userDbs = dbList.filter((dbName) => dbName.endsWith(hexUsername));
    const sharedDbs = dbList.filter(
      (dbName) => !dbName.startsWith("orders") && !dbName.startsWith("basket")
    );

    return {
      privateDB: userDbs,
      sharedDB: sharedDbs,
    };
  } catch (error: any) {
    console.error(
      `Error retrieving databases for user ${username}:`,
      error.message
    );
    throw error;
  }
};

export { getUserDatabases };
