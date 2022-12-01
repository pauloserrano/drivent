import { Hotel } from "@prisma/client";
import { prisma } from "@/config";
import { createHotel } from "./hotels-factory";
import faker from "@faker-js/faker";
import { createBooking } from "./bookings-factory";

export async function createRoom(hotel?: Hotel) {
  const incomingHotel = hotel || (await createHotel());

  return prisma.room.create({
    data: {
      name: `${faker.datatype.number({ min: 1, max: 9 }) * 100}`,
      capacity: faker.datatype.number({ min: 1, max: 6 }),
      hotelId: incomingHotel.id
    }
  });
}

export async function createManyRooms(hotel?: Hotel) {
  const incomingHotel = hotel || (await createHotel());
  const roomNum = faker.datatype.number({ min: 1, max: 9 }) * 100;
  
  return prisma.room.createMany({
    data: [
      { name: `${roomNum}`, capacity: 1, hotelId: incomingHotel.id },
      { name: `${roomNum + 1}`, capacity: 2, hotelId: incomingHotel.id },
      { name: `${roomNum + 1}`, capacity: 2, hotelId: incomingHotel.id },
      { name: `${roomNum + 1}`, capacity: 2, hotelId: incomingHotel.id },
      { name: `${roomNum + 1}`, capacity: 2, hotelId: incomingHotel.id }
    ]
  });
}

export async function createFilledRoom(hotel?: Hotel) {
  const incomingHotel = hotel || (await createHotel());
  const room = await prisma.room.create({
    data: {
      name: `${faker.datatype.number({ min: 1, max: 9 }) * 100}`, 
      capacity: 1, 
      hotelId: incomingHotel.id
    }
  });
  await createBooking(undefined, room);

  return room;
}
