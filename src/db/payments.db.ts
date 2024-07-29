import nanoInstance from "./db.service";
import { designDoc } from "./design_documents/payments.design.doc";

const dbName = "orders";

export const initOrdersDB = async () => {
  try {
    const dbList = await nanoInstance.db.list();
    if (dbList.includes(dbName)) {
      return;
    }

    await nanoInstance.db.create(dbName);

    const db = nanoInstance.db.use(dbName);

    // add admin role to security document
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

    // insert order design doc
    await db.insert(designDoc);

    console.log("Payments database initialized successfully.");
  } catch (err) {
    console.error("Error initializing orders database:", err);
  }
};

export default nanoInstance.use(dbName);
