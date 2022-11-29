import { prisma } from "@/config";

async function findBookingByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: { userId },
    include: {
      Room: true
    }
  });
}

async function findBookingById(id: number) {
  return prisma.booking.findFirst({
    where: { id }
  });
}

async function findBookingByRoomId(roomId: number) {
  return prisma.booking.findFirst({
    where: { roomId }
  });
}

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId
    }
  }); 
}

const bookingRepository = {
  findBookingByUserId,
  findBookingById,
  findBookingByRoomId,
  createBooking
};

export default bookingRepository;
