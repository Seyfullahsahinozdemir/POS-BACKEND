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

    // Define venues and add tables
    const venues = ["venue_1", "venue_2", "venue_3"];
    const tablesPerVenue = 5;

    for (const venueId of venues) {
      for (let i = 1; i <= tablesPerVenue; i++) {
        const tableDoc = {
          id: `${venueId}_table_${i}`,
          type: "table",
          table_number: i,
          status: "available", // or any other default value
          venue_id: venueId,
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
