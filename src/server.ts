import server from ".";
import nano from "nano";

const couchDBPort = process.env.COUCHDB_PORT || "5984";
const couchDBUsername = process.env.COUCHDB_USERNAME || "";
const couchDBPassword = process.env.COUCHDB_PASSWORD || "";

const couch = nano(
  `http://${couchDBUsername}:${couchDBPassword}@127.0.0.1:${couchDBPort}`
);

async function connectToCouchDB() {
  try {
    await couch.db.list();
    console.log("Connected to CouchDB successfully");

    void server.listen(8000, () => {
      console.log("Server is running on port 8000");
    });
  } catch (error) {
    console.error("Failed to connect to CouchDB", error);
  }
}

connectToCouchDB();
