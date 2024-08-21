import { companyNanoInstances } from "../../db/services/db.service";
const follow = require("follow");

const dbName = "orders";
const retryDelay = 5000; // Retry delay in milliseconds

export const checkOrderConflicts = () => {
  Object.entries(companyNanoInstances).forEach(
    ([companyId, companyNanoInstance]) => {
      followDatabaseChanges(companyNanoInstance.config.url, dbName, companyId);
    }
  );
};

const followDatabaseChanges = (
  dbUrl: string,
  dbName: string,
  companyId: string
) => {
  const feed = new follow.Feed({
    db: `${dbUrl}/${dbName}`,
    since: "now",
    include_docs: true,
    conflicts: true,
  });

  feed.on("change", async (change: any) => {
    // if (change.doc) {
    //   const { _id, _rev, is_deleted } = change.doc;
    //   if (is_deleted) {
    //     try {
    //       await deleteDocument(dbUrl, dbName, _id, _rev);
    //       console.log(`Document ${_id} deleted successfully.`);
    //     } catch (err) {
    //       console.error(`Failed to delete document ${_id}:`, err);
    //     }
    //   }
    //   // Additional conflict resolution logic can go here
    //   // await resolveOrderConflict(companyId, change.doc);
    // }
  });

  feed.on("error", (err: any) => {
    if (err.message.includes("Database not found")) {
      console.log(
        `Retrying connection to ${dbName} in ${retryDelay / 1000} seconds...`
      );
      setTimeout(
        () => followDatabaseChanges(dbUrl, dbName, companyId),
        retryDelay
      );
    } else {
      setTimeout(
        () => followDatabaseChanges(dbUrl, dbName, companyId),
        retryDelay
      );
    }
  });

  feed.follow();
};

const deleteDocument = async (
  dbUrl: string,
  dbName: string,
  docId: string,
  rev: string
) => {
  const nano = require("nano")(dbUrl);
  const db = nano.use(dbName);
  await db.destroy(docId, rev);
};
