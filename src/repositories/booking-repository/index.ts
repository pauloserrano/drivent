import { Booking } from "@prisma/client";
import { prisma } from "@/config";

async function findBookingByUserId(userId: Booking["userId"]) {
  return prisma.booking.findFirst({
    where: { userId },
    include: {
      Room: true
    }
  });
}

async function findBookingById(id: Booking["id"]) {
  return prisma.booking.findFirst({
    where: { id }
  });
}

async function createBooking(userId: Booking["userId"], roomId: Booking["roomId"]) {
  return prisma.booking.create({
    data: {
      userId,
      roomId
    }
  }); 
}

async function updateBooking(id: Booking["id"], roomId: Booking["roomId"]) {
  return prisma.booking.update({
    where: { id },
    data: { roomId }
  });
}

const bookingRepository = {
  findBookingByUserId,
  findBookingById,
  createBooking,
  updateBooking
};

export default bookingRepository;
