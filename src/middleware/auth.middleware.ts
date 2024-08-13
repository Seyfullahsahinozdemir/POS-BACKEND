// import { CouchAuth } from "@perfood/couch-auth";
// import {
//   companyNanoInstances,
//   masterNanoInstance,
// } from "../db/services/db.service";
// import { company1Config } from "../utils/auth/company1.auth.utils";

// // Middleware to check and add 'waiter' role to users on login
// const handleLogin = async (userDoc: any, companyId: string) => {
//   try {
//     await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 saniye bekle

//     const companyNanoInstance = companyNanoInstances[companyId];

//     if (!companyNanoInstance) {
//       throw new Error("Invalid or missing companyId");
//     }

//     const user: any = await companyNanoInstance
//       .use("_users")
//       .get(`org.couchdb.user:${userDoc.token}`);

//     if (!user.roles.includes("waiter")) {
//       user.roles.push("waiter");
//       await masterNanoInstance.use("_users").insert(user);
//     }
//   } catch (err) {
//     console.error("Error checking/adding role to user on login:", err);
//   }
// };

// // Middleware to check and add 'waiter' role to users on signup
// const handleSignup = async (userDoc: any, companyId: string) => {
//   try {
//     await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 saniye bekle

//     const companyNanoInstance = companyNanoInstances[companyId];

//     if (!companyNanoInstance) {
//       throw new Error("Invalid or missing companyId");
//     }

//     // Fetch the user document from the sl-users database of the corresponding company
//     const user: any = await companyNanoInstance
//       .use("sl-users")
//       .get(userDoc._id);

//     // Check if the 'waiter' role is already in the user's roles
//     if (!user.roles.includes("waiter")) {
//       user.roles.push("waiter"); // Add 'waiter' role
//     }

//     // Add the companyId to the user document
//     if (!user.companyId) {
//       user.companyId = companyId;
//     }

//     // Save the updated user document
//     await companyNanoInstance.use("sl-users").insert(user);
//   } catch (err) {
//     console.error("Error checking/adding role to user on signup:", err);
//   }
// };

// // Register the middleware with all CouchAuth instances for login and signup
// const companyIds = process.env.COMPANY_IDS
//   ? process.env.COMPANY_IDS.split(",").map((id) => id.trim())
//   : [];

// for (let i = 0; i < companyIds.length; i++) {
//   if (i == 0) {
//     const couchAuth = new CouchAuth(company1Config);

//     // Kullanıcı kaydı için olay işleyici
//     couchAuth.emitter.on("signup", (userDoc: any) => {
//       handleSignup(userDoc, "1");
//     });

//     // Kullanıcı girişi için olay işleyici
//     couchAuth.emitter.on("login", (userDoc: any) => {
//       handleLogin(userDoc, "1");
//     });
//   } else if (i == 1) {
//     const couchAuth = new CouchAuth(company1Config);

//     // Kullanıcı kaydı için olay işleyici
//     couchAuth.emitter.on("signup", (userDoc: any) => {
//       handleSignup(userDoc, "2");
//     });

//     // Kullanıcı girişi için olay işleyici
//     couchAuth.emitter.on("login", (userDoc: any) => {
//       handleLogin(userDoc, "2");
//     });
//   }
// }

// // export default companyConfigs;
