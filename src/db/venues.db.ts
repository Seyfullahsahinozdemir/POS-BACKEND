import nanoInstance from "./db.service";
import { designDoc } from "./design_documents/venues.design.doc";

const dbName = "venues";

export const initVenuesDB = async () => {
  try {
    const dbList = await nanoInstance.db.list();
    if (dbList.includes(dbName)) {
      return;
    }

    await nanoInstance.db.create(dbName);

    const db = nanoInstance.db.use(dbName);

    // add waiter as member access role
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

    // Add venue documents
    const venues = [
      { id: "venue_1", type: "venue", name: "restaurant" },
      { id: "venue_2", type: "venue", name: "bar" },
      { id: "venue_3", type: "venue", name: "pool" },
    ];

    for (const venue of venues) {
      await db.insert(venue as any);
    }

    console.log("Venues added successfully");
  } catch (err) {
    console.error("Error creating design document or adding venues:", err);
  }
};

export default nanoInstance.db.use(dbName);
