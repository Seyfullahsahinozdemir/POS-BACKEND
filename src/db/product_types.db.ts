import nanoInstance from "./db.service";
import { designDoc } from "./design_documents/product_types.design.doc";

const dbName = "product_types";

export const initProductTypesDB = async () => {
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

    // insert product types design doc
    await db.insert(designDoc);

    // Add product types documents
    const productTypes = [
      {
        id: "product_type_1",
        type: "product_type",
        name: "beverages",
        place: "restaurant",
        place_id: "place_1",
      },
      {
        id: "product_type_2",
        type: "product_type",
        name: "snacks",
        place: "bar",
        place_id: "place_2",
      },
      {
        id: "product_type_3",
        type: "product_type",
        name: "drinks",
        place: "pool",
        place_id: "place_3",
      },
    ];

    for (const productType of productTypes) {
      await db.insert(productType as any);
    }

    console.log("Product types added successfully");
  } catch (err) {
    console.error(
      "Error creating design document or adding product types:",
      err
    );
  }
};

export default nanoInstance.db.use(dbName);
