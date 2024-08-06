// import nanoInstance, {
//   remoteCouchStatus,
//   remoteNanoInstance,
// } from "./db.service";
// import { designDoc } from "./design_documents/payments.design.doc";

// const dbName = "payments";

// const createReplicationDoc = (sourceDb: any, targetDb: any) => ({
//   _id: `replication_${sourceDb}_${targetDb}`,
//   source: sourceDb,
//   target: targetDb,
//   create_target: true,
//   continuous: true,
// });

// export const initPaymentsDB = async () => {
//   try {
//     const dbList = await nanoInstance.db.list();
//     if (dbList.includes(dbName)) {
//       return;
//     }

//     await nanoInstance.db.create(dbName);

//     const db = nanoInstance.db.use(dbName);

//     // add admin role to security document
//     let securityDoc: any;
//     try {
//       securityDoc = await db.get("_security");
//     } catch (err: any) {
//       if (err.statusCode === 404) {
//         securityDoc = { members: { roles: [] } };
//       } else {
//         throw err;
//       }
//     }

//     const members = securityDoc.members || {};

//     if (!members.roles) {
//       members.roles = [];
//     }
//     if (!members.roles.includes("waiter")) {
//       members.roles.push("waiter");
//     }

//     securityDoc.members = members;

//     await db.insert(securityDoc, "_security");

//     // insert order design doc
//     await db.insert(designDoc);

//     console.log("Payments database initialized successfully.");

//     if (!remoteCouchStatus) {
//       return;
//     }

//     const remoteDbList = await remoteNanoInstance.db.list();
//     if (!remoteDbList.includes(dbName)) {
//       await remoteNanoInstance.db.create(dbName);

//       const remoteDb = remoteNanoInstance.db.use(dbName);

//       // insert order design doc
//       await remoteDb.insert(designDoc);

//       console.log("Remote Payments database initialized successfully.");
//     }

//     // Ensure _replicator database exists
//     const replicatorDbName = "_replicator";
//     const replicatorDbList = await nanoInstance.db.list();
//     if (!replicatorDbList.includes(replicatorDbName)) {
//       await nanoInstance.db.create(replicatorDbName);
//       console.log("_replicator database created successfully.");
//     }

//     // Create replication documents in _replicator database
//     const replicatorDb = nanoInstance.db.use(replicatorDbName);

//     await replicatorDb.insert(
//       createReplicationDoc(
//         "http://admin:password@127.0.0.1:5984/" + dbName,
//         `${remoteNanoInstance.config.url}/${dbName}`
//       )
//     );
//     await replicatorDb.insert(
//       createReplicationDoc(
//         `${remoteNanoInstance.config.url}/${dbName}`,
//         "http://admin:password@127.0.0.1:5984/" + dbName
//       )
//     );

//     console.log(
//       "Replication between local and remote Payments database set up successfully."
//     );
//   } catch (err) {
//     console.error("Error initializing payments database:", err);
//   }
// };

// export default nanoInstance.use(dbName);
