import nanoInstance from "./db.service";

const dbName = "sl-users";

export const initAppUsersDB = async () => {
  try {
    const dbList = await nanoInstance.db.list();
    if (dbList.includes(dbName)) {
      return;
    }

    await nanoInstance.db.create(dbName);
  } catch (err) {
    console.error("Error initializing products database:", err);
  }
};

export default nanoInstance.db.use(dbName);
