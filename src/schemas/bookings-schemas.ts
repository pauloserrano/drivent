import { newBookingBody } from "@/services";
import Joi from "joi";

export const createBookingSchema = Joi.object<newBookingBody>({
  roomId: Joi.number().required()
});
