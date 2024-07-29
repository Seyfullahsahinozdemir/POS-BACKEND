import nanoInstance from "./db.service";
import { designDoc } from "./design_documents/tables.design.doc";

const dbName = "tables";

export const initTablesDB = async () => {
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

    // insert table design doc
    await db.insert(designDoc);

    // Define places and add tables
    const places = ["place_1", "place_2", "place_3"];
    const tablesPerplace = 10;

    for (const placeId of places) {
      for (let i = 1; i <= tablesPerplace; i++) {
        const tableDoc = {
          id: `${placeId}_table_${i}`,
          type: "table",
          table_number: i,
          status: "available", // or any other default value
          place_id: placeId,
        };
        await db.insert(tableDoc as any);
      }
    }

    console.log("Tables added successfully");
  } catch (err) {
    console.error("Error creating design document or adding tables:", err);
  }
};

export default nanoInstance.db.use(dbName);
