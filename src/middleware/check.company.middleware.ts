import { Request, Response, NextFunction } from "express";
import CustomResponse from "../utils/custom.response";
import { CouchAuth } from "@perfood/couch-auth";
import { companiesConfig } from "../utils/auth/companies.auth.utils";

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

  (req as any).companyConfig = new CouchAuth(
    companiesConfig[Number(companyId)]
  );

  // Attach the correct companyConfig to the request object
  next();
};
