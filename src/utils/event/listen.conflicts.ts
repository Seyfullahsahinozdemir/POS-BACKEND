import { companyNanoInstances } from "../../db/services/db.service";
const follow = require("follow");

const dbName = "tables";
const retryDelay = 5000; // Retry delay in milliseconds

export const checkConflicts = () => {
  Object.entries(companyNanoInstances).forEach(
    ([companyId, companyNanoInstance]) => {
      followDatabaseChanges(companyNanoInstance.config.url, dbName, companyId);
    }
  );
};

const followDatabaseChanges = (dbUrl: any, dbName: any, companyId: any) => {
  const feed = new follow.Feed({
    db: `${dbUrl}/${dbName}`,
    since: "now",
    include_docs: true,
    conflicts: true,
  });

  feed.on("change", async (change: any) => {
    console.log(change);
    if (change.doc && change.doc._conflicts) {
      await resolveConflict(companyId, change.doc);
    }
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
      // For other errors, restart the follow after a delay
      setTimeout(
        () => followDatabaseChanges(dbUrl, dbName, companyId),
        retryDelay
      );
    }
  });

  feed.follow();
};

const resolveConflict = async (companyId: string, doc: any) => {
  const companyNanoInstance = companyNanoInstances[companyId];
  const db = companyNanoInstance.use(dbName);

  try {
    // Get all conflicting revisions
    const conflicts = await Promise.all(
      doc._conflicts.map((rev: string) => db.get(doc._id, { rev }))
    );

    // Check if all conflicts have the same testid value
    const company_id = doc.company_id;
    const allCompanyIdMatch = conflicts.every(
      (conflict: any) => conflict.company_id === company_id
    );

    if (!allCompanyIdMatch) {
      console.log(
        `Conflict resolution aborted for document ${doc._id} due to mismatched company_id values.`
      );
      return;
    }

    // Merge the orders arrays from the main doc and all conflicts
    const mergedOrders = [
      ...doc.orders,
      ...conflicts.flatMap((conflict: any) => conflict.orders),
    ];

    // // Remove duplicate orders if needed
    // const uniqueOrders = mergedOrders.reduce((acc: any, order: any) => {
    //   if (!acc.find((o: any) => o.id === order.id)) {
    //     acc.push(order);
    //   }
    //   return acc;
    // }, []);

    // Save the resolved document
    const resolvedDoc = {
      ...doc,
      orders: mergedOrders,
      _conflicts: undefined, // Clear the conflicts field
    };

    await db.insert(resolvedDoc);

    // Delete the conflicting revisions
    for (const conflict of conflicts) {
      await db.destroy(conflict._id, conflict._rev);
    }

    console.log(`Conflict resolved for document ${doc._id}`);
  } catch (error) {
    console.error(`Error resolving conflict for document ${doc._id}:`, error);
  }
};
