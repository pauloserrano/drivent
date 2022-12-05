import { Booking, TicketStatus } from "@prisma/client";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError } from "@/errors";
import { accessDeniedError } from "../hotels-service";
import roomRepository from "@/repositories/room-repository";

async function getBookingByUser(userId: Booking["userId"]) {
  await hasValidEnrollment(userId);

  const booking = await bookingRepository.findBookingByUserId(userId);
  if (!booking) throw notFoundError();

  return booking;
}

async function postBooking(userId: Booking["userId"], roomId: Booking["roomId"]): Promise<Booking> {
  await hasValidEnrollment(userId);
  
  const room = await roomRepository.findRoomById(roomId);
  if (!room) {
    throw notFoundError();
  }

  if (room._count.Booking === room.capacity) {
    throw accessDeniedError();
  }

  return bookingRepository.createBooking(userId, roomId);
}

async function updateBooking(userId: Booking["userId"], bookingId: Booking["id"], roomId: Booking["roomId"]): Promise<Booking> {
  const booking = await bookingRepository.findBookingById(bookingId);
  if (!booking) {
    throw accessDeniedError();
  }

  if (booking.userId !== userId) {
    throw accessDeniedError();
  }

  const room = await roomRepository.findRoomById(roomId);
  if (!room) {
    throw notFoundError();
  }

  if (room._count.Booking === room.capacity) {
    throw accessDeniedError();
  }

  return bookingRepository.updateBooking(booking.id, roomId);
}

async function hasValidEnrollment(userId: Booking["userId"]): Promise<void> {
  const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);
  if (!enrollment) {
    throw accessDeniedError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) {
    throw accessDeniedError();
  }

  if (ticket.status !== TicketStatus.PAID) {
    throw accessDeniedError();
  }

  if (!ticket.TicketType.includesHotel || ticket.TicketType.isRemote) {
    throw accessDeniedError();
  }
}

export type newBookingBody = {
  roomId: Booking["roomId"]
}

export type newBookingParam = {
  bookingId: Booking["id"]
}

const bookingsService = {
  getBookingByUser,
  updateBooking,
  postBooking
};

export default bookingsService;
