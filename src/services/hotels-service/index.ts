import { Hotel } from "@prisma/client";
import hotelRepository from "@/repositories/hotel-repository";

async function getHotels() {
  return hotelRepository.findHotels();
}

async function getHotelById(hotelId: number): Promise<Hotel> {
  return hotelRepository.findHotelById(hotelId);
}

const hotelsService = {
  getHotels,
  getHotelById
};

export default hotelsService;
