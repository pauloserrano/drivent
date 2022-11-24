import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import hotelService from "@/services/hotels-service";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  try {
    const hotels = await hotelService.getHotels();
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
  const { hotelId } = req.params;
  try {
    const hotel = await hotelService.getHotelById(+hotelId);
    return res.status(httpStatus.OK).send(hotel);
  } catch (error) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
