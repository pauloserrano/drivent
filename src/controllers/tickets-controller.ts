import { Response } from "express";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "@/middlewares";
import ticketsService from "@/services/tickets-service";

export async function getTicketTypes(req: AuthenticatedRequest, res: Response) {
  try {
    const tickets = await ticketsService.getTicketTypes();
    return res.status(httpStatus.OK).send(tickets);
  } catch (error) {
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }
}

export async function getTicketByUser(req: AuthenticatedRequest, res: Response) {
  try {
    const ticket = await ticketsService.getTicketByUser(req.userId);
    return res.status(httpStatus.OK).send(ticket);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }
}

export async function postNewTicket(req: AuthenticatedRequest, res: Response) {
  try {
    const ticket = await ticketsService.setTicket({ 
      userId: req.userId, 
      ticketTypeId: req.body.ticketTypeId 
    });
    return res.status(httpStatus.CREATED).send(ticket);
  } catch (error) {
    if (error.name === "InvalidBody") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }
}
