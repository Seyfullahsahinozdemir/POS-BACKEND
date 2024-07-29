import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import cors from "cors";
import couchAuth from "./middleware/auth.middleware";
import paymentRouter from "./router/payment.router";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

app.use("/api/auth", couchAuth.router);
app.use("/api/payment", paymentRouter);

export default server;
