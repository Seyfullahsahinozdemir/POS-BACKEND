import { Router } from "express";
import { pay } from "../controller/payment.controller";
import couchAuth from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/pay/:orderId",
  couchAuth.requireAuth,
  couchAuth.requireRole("waiter") as any,
  pay
);

export default router;
