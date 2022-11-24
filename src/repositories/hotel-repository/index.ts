import { prisma } from "@/config";
import { Hotel } from "@prisma/client";

async function findHotels(): Promise<Hotel[]> {
  return prisma.hotel.findMany();
}

async function findHotelById(id: number): Promise<Hotel> {
  return prisma.hotel.findFirst({
    where: { id }
  });
}

const hotelRepository = {
  findHotels,
  findHotelById
};

export default hotelRepository;
