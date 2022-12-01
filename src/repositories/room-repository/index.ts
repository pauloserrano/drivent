import { prisma } from "@/config";

async function findRoomById(id: number) {
  return prisma.room.findFirst({
    where: { id },
    include: {
      _count: {
        select: {
          Booking: true
        }
      }
    }
  });
}

const roomRepository = {
  findRoomById
};

export default roomRepository;
