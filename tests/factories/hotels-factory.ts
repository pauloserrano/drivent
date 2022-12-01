import { prisma } from "@/config";
import faker from "@faker-js/faker";

export async function createValidTicketType() {
  return prisma.ticketType.create({
    data: {
      name: faker.lorem.words(),
      price: faker.datatype.number(),
      isRemote: false,
      includesHotel: true,
    },
  });
}

export async function createInvalidTicketType() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.jobDescriptor(),
      price: faker.datatype.number(),
      isRemote: true,
      includesHotel: true,
    },
  });
}

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      image: faker.image.business(),
      name: faker.name.findName(),
    }
  });
}
