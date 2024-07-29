import nanoInstance from "./db.service";
import { designDoc } from "./design_documents/places.design.doc";

const dbName = "places";

export const initplacesDB = async () => {
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

    // Add place documents
    const places = [
      { id: "place_1", type: "place", name: "restaurant" },
      { id: "place_2", type: "place", name: "bar" },
      { id: "place_3", type: "place", name: "pool" },
    ];

    for (const place of places) {
      await db.insert(place as any);
    }

    console.log("places added successfully");
  } catch (err) {
    console.error("Error creating design document or adding places:", err);
  }
};

export default nanoInstance.db.use(dbName);
