import { Hotel } from "@prisma/client";
import { prisma } from "@/config";
import { createHotel } from "./hotels-factory";

export async function createRoom(hotel?: Hotel) {
  const incomingHotel = hotel || (await createHotel());

  return prisma.room.create({
    data: {
      name: "110",
      capacity: 2,
      hotelId: incomingHotel.id
    }
  });
}

export async function createManyRooms(hotel?: Hotel) {
  const incomingHotel = hotel || (await createHotel());
  
  return prisma.room.createMany({
    data: [
      { name: "101", capacity: 1, hotelId: incomingHotel.id },
      { name: "102", capacity: 2, hotelId: incomingHotel.id },
      { name: "103", capacity: 2, hotelId: incomingHotel.id },
      { name: "104", capacity: 2, hotelId: incomingHotel.id },
      { name: "105", capacity: 2, hotelId: incomingHotel.id }
    ]
  });
}
