import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import hotelService from "@/services/hotels-service";
import httpStatus from "http-status";

export async function getHotelData(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const hotelId = req.params.hotelId as string;

  try {
    const hotels = await hotelService.getHotelData(+userId, hotelId);
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    switch (error.name) {
    case "AccessDeniedError":
      return res.sendStatus(httpStatus.FORBIDDEN);
    
    case "NotFoundError":
      return res.sendStatus(httpStatus.NOT_FOUND);
    
    case "PaymentRequiredError":
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    
    case "UnauthorizedError":
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    
    default:
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
  }
}
