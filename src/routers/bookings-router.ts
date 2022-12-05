import { Router } from "express";
import { getBooking, postBooking, updateBooking } from "@/controllers";
import { authenticateToken, validateBody, validateParams } from "@/middlewares";
import { createBookingBodySchema, updateBookingParamsSchema } from "@/schemas/bookings-schemas";

const bookingsRouter = Router();

bookingsRouter
  .all("/*", authenticateToken)
  .get("/", getBooking)
  .post("/", validateBody(createBookingBodySchema), postBooking)
  .put("/:bookingId", validateParams(updateBookingParamsSchema), validateBody(createBookingBodySchema), updateBooking);

export { bookingsRouter };
