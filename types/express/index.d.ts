import { Request } from "express";

declare global {
  declare namespace Express {
    interface Request {
      user: {
        id: string;
        username: string;
        isAdmin: boolean;
        email: string;
      };
    }
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      COUCHDB_URL: string;
      SERVER_PORT: string;
      COUCHDB_USERNAME: string;
      COUCHDB_PASSWORD: string;
    }
  }
}
