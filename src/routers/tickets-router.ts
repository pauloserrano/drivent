import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getTicketTypes, getTicketByUser, postNewTicket } from "@/controllers";

const ticketsRouter = Router();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/types", getTicketTypes)
  .get("/", getTicketByUser)
  .post("/", postNewTicket)
;

export { ticketsRouter };
