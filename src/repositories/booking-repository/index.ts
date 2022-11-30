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

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId
    }
  }); 
}

async function deleteBookingById(id: number) {
  return prisma.booking.delete({
    where: { id }
  });
}

const bookingRepository = {
  findBookingByUserId,
  findBookingById,
  createBooking,
  deleteBookingById
};

export default bookingRepository;
