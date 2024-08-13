// Master database configuration
const masterConfig: any = {
  dbServer: {
    protocol: "http://",
    host: process.env.MASTER_DB_HOST as string,
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

export { masterConfig };
