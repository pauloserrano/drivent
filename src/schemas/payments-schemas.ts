import { newPayment } from "@/services/payments-service";
import Joi from "joi";

export const newPaymentSchema = Joi.object<newPayment>({
  ticketId: Joi.number().required(),
  cardData: Joi.object().required()
});
