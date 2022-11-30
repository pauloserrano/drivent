import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import bookingsService from "@/services/bookings-service";
import httpStatus from "http-status";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const booking = await bookingsService.getBookingByUser(+userId);
    return res.status(httpStatus.OK).send({
      id: booking.id,
      Room: booking.Room
    });
  } catch (error) {
    switch (error.name) {
    case "AccessDeniedError":
      return res.sendStatus(httpStatus.FORBIDDEN);
    
    case "NotFoundError":
      return res.sendStatus(httpStatus.NOT_FOUND);
    
    default:
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const roomId = req.body.roomId as number;

  try {
    const booking = await bookingsService.postBooking(userId, roomId);
    return res.status(httpStatus.OK).send({ bookingId: booking.id });
  } catch (error) {
    switch (error.name) {
    case "AccessDeniedError":
      return res.sendStatus(httpStatus.FORBIDDEN);
    
    case "NotFoundError":
      return res.sendStatus(httpStatus.NOT_FOUND);
    
    default:
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const bookingId = req.params.bookingId as string;
  const roomId = req.body.roomId as number;

  try {
    const booking = await bookingsService.updateBooking(userId, +bookingId, roomId);
    return res.status(httpStatus.OK).send({ booking: booking.id });
  } catch (error) {
    switch (error.name) {
    case "AccessDeniedError":
      return res.sendStatus(httpStatus.FORBIDDEN);
    
    case "NotFoundError":
      return res.sendStatus(httpStatus.NOT_FOUND);
    
    default:
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
  }
}
