import { Request, Response, NextFunction } from "express";
import CustomResponse from "../utils/custom.response";
import { CouchAuth } from "@perfood/couch-auth";
import { company1Config } from "../utils/auth/company1.auth.utils";
import { company2Config } from "../utils/auth/company2.auth.utils";

// Middleware to determine the correct companyConfig based on request
export const checkCompanyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Assume the company ID is passed in the request headers
  const companyId = req.headers["x-company-id"] as string;

  if (!companyId) {
    return new CustomResponse(null, "Invalid or missing company ID").error400(
      res
    );
  }

  if (companyId == "1") {
    (req as any).companyConfig = new CouchAuth(company1Config);
  }
  if (companyId == "2") {
    (req as any).companyConfig = new CouchAuth(company2Config);
  }
  // Attach the correct companyConfig to the request object
  next();
};
