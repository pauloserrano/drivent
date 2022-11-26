import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getHotelData } from "@/controllers";

const hotelsRouter = Router();

hotelsRouter
  .all("/*", authenticateToken)
  .get("/", getHotelData)
  .get("/:hotelId", getHotelData);

export { hotelsRouter };
