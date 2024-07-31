import { CouchAuth } from "@perfood/couch-auth";

const config: any = {
  dbServer: {
    protocol: "http://",
    host: "localhost:5984",
    user: process.env.COUCHDB_USERNAME,
    password: process.env.COUCHDB_PASSWORD,
    userDB: "sl-users",
    couchAuthDB: "_users",
  },
  local: {
    emailUsername: false,
    usernameLogin: true,
    sendConfirmEmail: false,
    requireEmailConfirm: false,
  },
  mailer: {
    fromEmail: "gmail.user@gmail.com",
    options: {
      service: "Gmail",
      auth: {
        user: "gmail.user@gmail.com",
        pass: "userpass",
      },
    },
  },
  userDBs: {
    defaultDBs: {
      private: [],
    },
  },
};

// Initialize CouchAuth
const couchAuth = new CouchAuth(config);

export default couchAuth;
