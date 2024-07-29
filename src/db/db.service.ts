import nano from "nano";

const couchDBPort = process.env.COUCHDB_PORT || "5984";
const couchDBUsername = process.env.COUCHDB_USERNAME || "";
const couchDBPassword = process.env.COUCHDB_PASSWORD || "";

// an instance created as admin.
const nanoInstance = nano(
  `http://${couchDBUsername}:${couchDBPassword}@127.0.0.1:${couchDBPort}`
);

export default nanoInstance;
