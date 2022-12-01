import { newBookingBody, newBookingParam } from "@/services";
import Joi from "joi";

export const createBookingBodySchema = Joi.object<newBookingBody>({
  roomId: Joi.number().required()
});

export const updateBookingParamsSchema = Joi.object<newBookingParam>({
  bookingId: Joi.number().required()
});
