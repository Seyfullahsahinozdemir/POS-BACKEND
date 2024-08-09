// places.db.ts
import {
  masterNanoInstance,
  companyNanoInstances,
} from "./services/db.service";
import {
  validationDesignDoc,
  filterDesignDoc,
} from "./design_documents/places.design.doc";
import {
  ensureDatabaseExists,
  addSecurityRole,
  insertDesignDocs,
  insertDocuments,
  setupReplication,
} from "./services/common.db";

const dbName = "places";

export const initPlacesDB = async () => {
  try {
    // Ensure databases exist
    await ensureDatabaseExists(masterNanoInstance, dbName);
    for (const companyInstance of Object.values(companyNanoInstances)) {
      await ensureDatabaseExists(companyInstance, dbName);
    }

    const masterDb = masterNanoInstance.db.use(dbName);

    // Add waiter as member access role
    await addSecurityRole(masterDb, "waiter");

    // Insert design docs for master
    await insertDesignDocs(masterDb, [validationDesignDoc, filterDesignDoc]);

    // Insert design docs for each company database
    for (const companyInstance of Object.values(companyNanoInstances)) {
      const companyDb = companyInstance.db.use(dbName);
      await insertDesignDocs(companyDb, [validationDesignDoc, filterDesignDoc]);
      await addSecurityRole(companyInstance.db.use(dbName), "waiter");
    }

    // Add place documents
    const places = [
      {
        id: "place_1",
        type: "place",
        company_id: 1,
        image_src: "/assets/restaurant.jpg",
        name: "restaurant",
      },
      {
        id: "place_2",
        type: "place",
        company_id: 1,
        image_src: "assets/bar.jpg",
        name: "bar",
      },
      {
        id: "place_3",
        type: "place",
        company_id: 1,
        image_src: "assets/poolbar.jpg",
        name: "pool",
      },
      {
        id: "place_4",
        type: "place",
        company_id: 2,
        image_src: "/assets/restaurant.jpg",
        name: "restaurant",
      },
      {
        id: "place_5",
        type: "place",
        company_id: 2,
        image_src: "assets/bar.jpg",
        name: "bar",
      },
      {
        id: "place_6",
        type: "place",
        company_id: 2,
        image_src: "assets/poolbar.jpg",
        name: "pool",
      },
    ];

    await insertDocuments(masterDb, places);

    // Setup replication
    await setupReplication(masterNanoInstance, companyNanoInstances, dbName);
  } catch (err) {
    console.error("Error initializing places database:", err);
  }
};

export default masterNanoInstance.db.use(dbName);
