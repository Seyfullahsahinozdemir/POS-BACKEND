import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import cors from "cors";
import { checkCompanyMiddleware } from "./middleware/check.company.middleware";

const app = express();
app.use(cors());
app.use(express.json());

// Use middleware to determine the correct companyConfig based on the request
app.use(checkCompanyMiddleware);

// Middleware to wait for 10 seconds after companyConfig is set
app.use((req, res, next) => {
  const companyConfig = (req as any).companyConfig;

  if (companyConfig) {
    setTimeout(() => {
      next();
    }, 3000); // 10 seconds
  } else {
    next();
  }
});

// Use the correct router based on the attached companyConfig
app.use("/api/auth", (req, res, next) => {
  const companyConfig = (req as any).companyConfig;

  if (companyConfig && companyConfig.router) {
    companyConfig.router(req, res, next);
  } else {
    res
      .status(404)
      .json({ error: "Router not found for the specified company" });
  }
});

const server = http.createServer(app);

export default server;
