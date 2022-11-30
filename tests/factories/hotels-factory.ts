import { prisma } from "@/config";

export async function createValidTicketType() {
  return prisma.ticketType.create({
    data: {
      name: "Valid Ticket",
      price: 123,
      isRemote: false,
      includesHotel: true,
    },
  });
}

export async function createInvalidTicketType() {
  return prisma.ticketType.create({
    data: {
      name: "Invalid Ticket",
      price: 123,
      isRemote: true,
      includesHotel: true,
    },
  });
}

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      image: "picsum.photos/200/200",
      name: "Hotel California",
    }
  });
}
