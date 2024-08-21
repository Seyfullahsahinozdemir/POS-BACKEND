import { companyNanoInstances } from "../../db/services/db.service";
const follow = require("follow");
const nano = require("nano"); // CouchDB client

const dbName = "tables";
const retryDelay = 5000; // Retry delay in milliseconds

export const checkTableConflicts = () => {
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
    // if (change.doc && change.doc._conflicts) {
    //   await resolveConflict(companyId, change.doc);
    // } else if (change.doc) {
    //   const { _id, _rev, orders } = change.doc;

    //   // Filter out deleted orders
    //   const updatedOrders = orders.filter((order: any) => !order.is_deleted);

    //   if (updatedOrders.length !== orders.length) {
    //     try {
    //       // Update the document with filtered orders
    //       const updatedDoc = {
    //         ...change.doc,
    //         orders: updatedOrders,
    //       };

    //       const db = nano(`${dbUrl}/${dbName}`);
    //       await db.insert(updatedDoc, _id, _rev);
    //       console.log(`Document ${_id} updated successfully.`);
    //     } catch (err) {
    //       console.error(`Failed to update document ${_id}:`, err);
    //     }
    //   }
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

    // Check if all conflicts have the same company_id value
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

    // Combine all orders, marking deletions correctly
    const combinedOrdersMap: Map<string, any> = new Map();

    // Include orders from the main doc
    doc.orders.forEach((order: any) => {
      combinedOrdersMap.set(order._id, order);
    });

    // Include and override with orders from conflicts
    conflicts.forEach((conflict: any) => {
      conflict.orders.forEach((order: any) => {
        // If the order is marked as deleted, remove it
        if (order.is_deleted) {
          combinedOrdersMap.delete(order._id);
        } else {
          combinedOrdersMap.set(order._id, order);
        }
      });
    });

    // Convert the combined orders map back to an array
    const resolvedOrders = Array.from(combinedOrdersMap.values());

    // Save the resolved document
    const resolvedDoc = {
      ...doc,
      orders: resolvedOrders,
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
