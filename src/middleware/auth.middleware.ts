import nanoInstance from "../db/db.service";
import couchAuth from "../utils/auth/couch.auth.utils";

// Middleware to check and add 'waiter' role to users on login
couchAuth.emitter.on("login", async (userDoc: any, provider: any) => {
  try {
    console.log(userDoc);

    const user: any = await nanoInstance
      .use("_users")
      .get(`org.couchdb.user:${userDoc.token}`);

    if (!user.roles.includes("waiter")) {
      user.roles.push("waiter");
      await nanoInstance.use("_users").insert(user);
    }
  } catch (err) {
    console.error("Error checking/adding role to user:", err);
  }
});

// Middleware to check and add 'waiter' role to users on signup
couchAuth.emitter.on("signup", async (userDoc: any) => {
  try {
    console.log("userdoc: ", userDoc);

    // Fetch the user document from the sl-users database using userDoc._id
    const user: any = await nanoInstance.use("sl-users").get(userDoc._id);

    // Check if the 'waiter' role is already in the user's roles
    if (!user.roles.includes("waiter")) {
      user.roles.push("waiter"); // Add 'waiter' role
      await nanoInstance.use("sl-users").insert(user); // Save the updated user document
    }
  } catch (err) {
    console.error("Error checking/adding role to user:", err);
  }
});

export default couchAuth;
