// common.db.ts

import { DocumentScope, ServerScope } from "nano";

// Helper function to ensure database exists
export const ensureDatabaseExists = async (
  instance: ServerScope,
  dbName: string
) => {
  const dbList = await instance.db.list();
  if (!dbList.includes(dbName)) {
    await instance.db.create(dbName);
  }
};

// Helper function to add a security role to a database
export const addSecurityRole = async (db: DocumentScope<any>, role: string) => {
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
  members.roles = members.roles || [];
  if (!members.roles.includes(role)) {
    members.roles.push(role);
  }
  securityDoc.members = members;

  await db.insert(securityDoc, "_security");
};

// Helper function to insert design documents into a database
export const insertDesignDocs = async (
  db: DocumentScope<any>,
  designDocs: any[]
) => {
  for (const designDoc of designDocs) {
    try {
      await db.get(designDoc._id);
    } catch (err: any) {
      if (err.statusCode === 404) {
        await db.insert(designDoc);
      } else {
        throw err;
      }
    }
  }
};

// Helper function to insert documents into a database
export const insertDocuments = async (
  db: DocumentScope<any>,
  documents: any[]
) => {
  // Check if there are any documents in the database that do not start with '_design'
  const allDocs = await db.list({ include_docs: true });
  const hasNonDesignDoc = allDocs.rows.some(
    (row) => !row.id.startsWith("_design")
  );

  if (hasNonDesignDoc) {
    return;
  }

  // Insert documents if there are no non-design documents
  for (const doc of documents) {
    try {
      await db.insert(doc);
    } catch (err: any) {
      console.error(`Error inserting document ${doc._id}:`, err);
    }
  }
};

// Helper function to create replication documents
export const createReplicationDoc = (
  source: string,
  target: string,
  companyId: number
) => ({
  _id: `${source}-${target}-${companyId}`,
  source: source,
  target: target,
  create_target: true,
  continuous: true,
  selector: {
    company_id: companyId,
  },
});

// Helper function to setup replication
export const setupReplication = async (
  masterInstance: ServerScope,
  companyInstances: { [key: string]: ServerScope },
  dbName: string
) => {
  const masterDbUrl = `${masterInstance.config.url}/${dbName}`;
  const replicatorDb = masterInstance.use("_replicator");

  // Function to check if a replication document already exists
  const replicationDocExists = async (docId: string) => {
    try {
      await replicatorDb.get(docId);
      return true;
    } catch (err: any) {
      if (err.statusCode === 404) {
        return false;
      }
      throw err;
    }
  };

  // Setup replication from master to company databases
  for (const [companyIdString, companyInstance] of Object.entries(
    companyInstances
  )) {
    const companyId = Number(companyIdString);
    const companyDbUrl = `${companyInstance.config.url}/${dbName}`;
    const replicationDocId = `${masterDbUrl}-${companyDbUrl}-${companyId}`;
    const replicationDocToCompany = createReplicationDoc(
      masterDbUrl,
      companyDbUrl,
      companyId
    );

    if (!(await replicationDocExists(replicationDocId))) {
      await replicatorDb.insert(replicationDocToCompany);
      console.log(
        `Replication setup from master to company database ${companyDbUrl}.`
      );
    }
  }

  // Setup replication from company databases to master
  for (const [companyIdString, companyInstance] of Object.entries(
    companyInstances
  )) {
    const companyId = Number(companyIdString);
    const companyDbUrl = `${companyInstance.config.url}/${dbName}`;
    const replicationDocId = `${companyDbUrl}-${masterDbUrl}-${companyId}`;
    const replicationDocToMaster = createReplicationDoc(
      companyDbUrl,
      masterDbUrl,
      companyId
    );

    if (!(await replicationDocExists(replicationDocId))) {
      await replicatorDb.insert(replicationDocToMaster);
      console.log(
        `Replication setup from company database ${companyId} to master.`
      );
    }
  }
};
