import { Request, Response, NextFunction } from "express";
import companyConfigs from "./auth.middleware";
import CustomResponse from "../utils/custom.response";

// Middleware to determine the correct companyConfig based on request
export const checkCompanyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Assume the company ID is passed in the request headers
  const companyId = req.headers["x-company-id"] as string;

  if (!companyId || !companyConfigs[companyId]) {
    return new CustomResponse(null, "Invalid or missing company ID").error400(
      res
    );
  }

  // Attach the correct companyConfig to the request object
  (req as any).companyConfig = companyConfigs[companyId];
  next();
};
