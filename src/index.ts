import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import cors from "cors";
import authRouter from "./router/auth.router";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

app.use("/api/auth", authRouter);

export default server;
