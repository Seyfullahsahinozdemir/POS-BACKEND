import { CouchAuth } from "@perfood/couch-auth";

// Master database configuration
const masterConfig: any = {
  dbServer: {
    protocol: process.env.MASTER_DB_PROTOCOL,
    host: process.env.MASTER_DB_HOST,
    user: process.env.MASTER_DB_USERNAME,
    password: process.env.MASTER_DB_PASSWORD,
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

// Initialize CouchAuth for master database
const masterCouchAuth = new CouchAuth(masterConfig);

// Company databases configuration
const companyConfigs: Record<string, CouchAuth> = {};
const companyIds = process.env.COMPANY_IDS
  ? process.env.COMPANY_IDS.split(",").map((id) => id.trim())
  : [];

const companyDbProtocols = process.env.COMPANY_DB_PROTOCOLS
  ? process.env.COMPANY_DB_PROTOCOLS.split(",").map((protocol) =>
      protocol.trim()
    )
  : [];
const companyDbHosts = process.env.COMPANY_DB_HOSTS
  ? process.env.COMPANY_DB_HOSTS.split(",").map((host) => host.trim())
  : [];
const companyDbUsernames = process.env.COMPANY_DB_USERNAMES
  ? process.env.COMPANY_DB_USERNAMES.split(",").map((username) =>
      username.trim()
    )
  : [];
const companyDbPasswords = process.env.COMPANY_DB_PASSWORDS
  ? process.env.COMPANY_DB_PASSWORDS.split(",").map((password) =>
      password.trim()
    )
  : [];

// Ensure that the configuration arrays have the same length or handle single company case
if (
  (companyIds.length > 1 &&
    (companyIds.length !== companyDbProtocols.length ||
      companyIds.length !== companyDbHosts.length ||
      companyIds.length !== companyDbUsernames.length ||
      companyIds.length !== companyDbPasswords.length)) ||
  (companyIds.length === 1 &&
    (companyDbProtocols.length > 1 ||
      companyDbHosts.length > 1 ||
      companyDbUsernames.length > 1 ||
      companyDbPasswords.length > 1))
) {
  throw new Error(
    "Mismatch in the length of company configuration arrays or invalid configuration"
  );
}

// Create CouchAuth instance for each company
companyIds.forEach((companyId, index) => {
  const companyConfig: any = {
    dbServer: {
      protocol: companyDbProtocols[0] || companyDbProtocols[index],
      host: companyDbHosts[0] || companyDbHosts[index],
      user: companyDbUsernames[0] || companyDbUsernames[index],
      password: companyDbPasswords[0] || companyDbPasswords[index],
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

  // Initialize CouchAuth for each company database
  companyConfigs[companyId] = new CouchAuth(companyConfig);
});

// Export CouchAuth instances
export { masterCouchAuth, companyConfigs };
