// Company 2 database configuration
const company2Config: any = {
  dbServer: {
    protocol: process.env.COMPANY_DB_PROTOCOLS!.split(",")[1].trim(),
    host: process.env.COMPANY_DB_HOSTS!.split(",")[1].trim(),
    user: process.env.COMPANY_DB_USERNAMES!.split(",")[1].trim(),
    password: process.env.COMPANY_DB_PASSWORDS!.split(",")[1].trim(),
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

export { company2Config };
