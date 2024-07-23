import { Request, Response, NextFunction } from "express";
import CustomResponse from "../utils/custom.response";
import { User } from "../interfaces/user.interface";
import userDB from "../db/users.db";
import {
  authenticate,
  getUserDatabases,
  setupUserDatabases,
} from "../db/db.service";

import { generateToken } from "../utils/jwt.utils";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password, firstName, lastName } = req.body;

  if (!username || !password || !firstName || !lastName) {
    return new CustomResponse(
      null,
      "username, password, first-name, last-name are required !!!"
    ).error400(res);
  }

  try {
    // check username is valid
    const userExists = await userDB
      .get(`org.couchdb.user:${username}`)
      .catch(() => null);

    if (userExists) {
      return new CustomResponse(
        null,
        "Username already exists. Please choose another one."
      ).error400(res);
    }

    const newUser: User = {
      _id: `org.couchdb.user:${username}`,
      name: username,
      password,
      firstName,
      lastName,
      type: "user",
      roles: [],
    };

    await userDB.insert(newUser);

    await setupUserDatabases(username);

    return new CustomResponse(null, "User registered successfully").created(
      res
    );
  } catch (error) {
    console.log(error);
    return new CustomResponse(null, "An error occurred on CouchDB").error500(
      res
    );
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return new CustomResponse(
      null,
      "username and password are required !!!"
    ).error400(res);
  }

  try {
    // check username and password correct or not.
    await authenticate(username, password);

    // reauthenticate as admin to list private and shared DBs.
    await authenticate(
      process.env.COUCHDB_USERNAME as string,
      process.env.COUCHDB_PASSWORD as string
    );

    const token = generateToken({ username });

    const { privateDB, sharedDB } = await getUserDatabases(username);

    return new CustomResponse(
      { token, privateDB, sharedDB },
      "User login successfully"
    ).created(res);
  } catch (error: any) {
    console.log(error);
    return new CustomResponse(null, error.description).error500(res);
  }
};
