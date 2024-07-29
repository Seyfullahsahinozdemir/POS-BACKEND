import server from ".";
import nano from "nano";
import { initTablesDB } from "./db/tables.db";
import { initProductsDB } from "./db/products.db";
import { initOrdersDB } from "./db/orders.db";
import { initDatabaseUserDB } from "./db/_users.db";
import { initAppUsersDB } from "./db/app.users.db";

const couchDBPort = process.env.COUCHDB_PORT || "5984";
const couchDBUsername = process.env.COUCHDB_USERNAME || "";
const couchDBPassword = process.env.COUCHDB_PASSWORD || "";

const couch = nano(
  `http://${couchDBUsername}:${couchDBPassword}@127.0.0.1:${couchDBPort}`
);

const initAllDBs = async () => {
  await initTablesDB();
  await initProductsDB();
  await initOrdersDB();
  await initDatabaseUserDB();
  await initAppUsersDB();
};

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
initAllDBs();
