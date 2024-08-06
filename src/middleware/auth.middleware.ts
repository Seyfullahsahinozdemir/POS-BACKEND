import {
  companyNanoInstances,
  masterNanoInstance,
} from "../db/services/db.service";
import { companyConfigs } from "../utils/auth/couch.auth.utils";

// Middleware to check and add 'waiter' role to users on login
const handleLogin = async (userDoc: any, companyId: string) => {
  try {
    if (!companyId || !companyConfigs[companyId]) {
      throw new Error("Invalid or missing companyId");
    }

    const user: any = await companyNanoInstances[companyId]
      .use("_users")
      .get(`org.couchdb.user:${userDoc.token}`);

    if (!user.roles.includes("waiter")) {
      user.roles.push("waiter");
      await masterNanoInstance.use("_users").insert(user);
    }
  } catch (err) {
    console.error("Error checking/adding role to user on login:", err);
  }
};

// Middleware to check and add 'waiter' role to users on signup
const handleSignup = async (userDoc: any, companyId: number) => {
  try {
    if (!companyId || !companyConfigs[companyId]) {
      throw new Error("Invalid or missing companyId");
    }

    // Fetch the user document from the sl-users database of the corresponding company
    const companyNanoInstance = companyNanoInstances[companyId];
    const user: any = await companyNanoInstance
      .use("sl-users")
      .get(userDoc._id);

    // Check if the 'waiter' role is already in the user's roles
    if (!user.roles.includes("waiter")) {
      user.roles.push("waiter"); // Add 'waiter' role
    }

    // Add the companyId to the user document
    if (!user.companyId) {
      user.companyId = companyId;
    }

    // Save the updated user document
    await companyNanoInstance.use("sl-users").insert(user);
  } catch (err) {
    console.error("Error checking/adding role to user on signup:", err);
  }
};

// Register the middleware with all CouchAuth instances for login and signup
Object.entries(companyConfigs).forEach(([companyId, couchAuth]) => {
  couchAuth.emitter.on("signup", (userDoc: any) => {
    const numericCompanyId = Number(companyId);

    handleSignup(userDoc, numericCompanyId);
  });
  couchAuth.emitter.on("login", handleLogin);
});

export default companyConfigs;
