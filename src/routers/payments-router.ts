import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getPayment, processPayment } from "@/controllers";
import { newPaymentSchema } from "@/schemas";

const paymentsRouter = Router();

paymentsRouter
  .all("/*", authenticateToken)
  .get("/", getPayment)
  .post("/process", validateBody(newPaymentSchema), processPayment)
;

export { paymentsRouter };
