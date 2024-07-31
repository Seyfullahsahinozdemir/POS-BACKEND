import nano from "nano";

const couchDBPort = process.env.COUCHDB_PORT || "5984";
const couchDBUsername = process.env.COUCHDB_USERNAME || "";
const couchDBPassword = process.env.COUCHDB_PASSWORD || "";

// an instance created as admin.
const nanoInstance = nano(
  `http://${couchDBUsername}:${couchDBPassword}@127.0.0.1:${couchDBPort}`
);

// default is local db
export default nanoInstance;

const remoteCouchDBUsername = process.env.REMOTE_COUCHDB_USERNAME;
const remoteCouchDBPassword = process.env.REMOTE_COUCHDB_PASSWORD;
const remoteCouchDBUrl = process.env.REMOTE_COUCHDB_URL;

// exports remote db
export const remoteNanoInstance = nano(
  `https://${remoteCouchDBUsername}:${remoteCouchDBPassword}@${remoteCouchDBUrl}`
);

export async function remoteCouchStatus() {
  try {
    await remoteNanoInstance.db.list();
    return true; // Connection is successful
  } catch (error) {
    console.error("Failed to connect to remote CouchDB:", error);
    return false; // Connection failed
  }
}
