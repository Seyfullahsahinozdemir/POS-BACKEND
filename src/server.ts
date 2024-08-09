import server from ".";
import { initTablesDB } from "./db/tables.db";
import { initProductsDB } from "./db/products.db";
import { initOrdersDB } from "./db/orders.db";
import { initUsersDB } from "./db/_users.db";
import { initAppUsersDB } from "./db/app.users.db";
import { initProductTypesDB } from "./db/product_types.db";
import { initPlacesDB } from "./db/places.db";
import { checkConflicts } from "./utils/event/listen.conflicts";
// import { initPaymentsDB } from "./db/payments.db";

const initAllDBs = async () => {
  await initUsersDB();
  await initAppUsersDB();

  await initTablesDB();
  await initProductsDB();
  await initOrdersDB();

  await initProductTypesDB();
  await initPlacesDB();
  // await initPaymentsDB();
};

async function runServer() {
  try {
    void server.listen(process.env.SERVER_PORT || 8000, () => {
      console.log(
        `Server is running on port ${process.env.SERVER_PORT || 8000}`
      );
    });
  } catch (error) {
    console.error("Failed to connect to Local CouchDB", error);
  }
}

runServer();
initAllDBs();
checkConflicts();
