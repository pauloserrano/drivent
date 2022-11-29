import { prisma } from "@/config";
import { Room, User } from "@prisma/client";
import { createRoom } from "./rooms-factory";
import { createUser } from "./users-factory";

export async function createBooking(user?: User, room?: Room) {
  const incomingUser = user || (await createUser());
  const incomingRoom = room || (await createRoom());

  return prisma.booking.create({
    data: {
      userId: incomingUser.id,
      roomId: incomingRoom.id
    }
  });
}
