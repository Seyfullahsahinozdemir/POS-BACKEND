import nano from "nano";

// Master database configuration
const masterDBHost = process.env.MASTER_DB_HOST;
const masterDBProtocol = process.env.MASTER_DB_PROTOCOL;
const masterDBUsername = process.env.MASTER_DB_USERNAME;
const masterDBPassword = process.env.MASTER_DB_PASSWORD;

// Create master Nano instance
export const masterNanoInstance = nano(
  `${masterDBProtocol}${masterDBUsername}:${masterDBPassword}@${masterDBHost}`
);

// Create company Nano instances
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

// Ensure each array has the same length or is of length 1
const companyIds = process.env.COMPANY_IDS
  ? process.env.COMPANY_IDS.split(",").map((id) => id.trim())
  : [];

// Validate the length of the configuration arrays
if (
  (companyIds.length > 1 &&
    (companyDbProtocols.length !== companyDbHosts.length ||
      companyDbProtocols.length !== companyDbUsernames.length ||
      companyDbProtocols.length !== companyDbPasswords.length ||
      companyIds.length !== companyDbProtocols.length)) ||
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

// Create an object to store company Nano instances
const companyNanoInstances: Record<string, any> = {};

// Create a Nano instance for each company
companyIds.forEach((companyId, index) => {
  if (companyIds.length === 1) {
    // Use the single configuration value if there is only one company
    companyNanoInstances[companyId] = nano(
      `${companyDbProtocols[0]}${companyDbUsernames[0]}:${companyDbPasswords[0]}@${companyDbHosts[0]}`
    );
  } else {
    // Use the index-specific configuration values if there are multiple companies
    companyNanoInstances[companyId] = nano(
      `${companyDbProtocols[index]}${companyDbUsernames[index]}:${companyDbPasswords[index]}@${companyDbHosts[index]}`
    );
  }
});

export { companyNanoInstances };
