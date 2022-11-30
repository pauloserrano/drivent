import { Booking, TicketStatus } from "@prisma/client";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError } from "@/errors";
import { accessDeniedError } from "../hotels-service";
import roomRepository from "@/repositories/room-repository";

async function getBookingByUser(userId: number) {
  await hasValidEnrollment(userId);

  const booking = await bookingRepository.findBookingByUserId(userId);
  if (!booking) throw notFoundError();

  return booking;
}

async function postBooking(userId: number, roomId: number): Promise<Booking> {
  await hasValidEnrollment(userId);
  
  if (!roomId) {
    throw accessDeniedError();
  }

  const room = await roomRepository.findRoomById(roomId);
  if (!room) {
    throw notFoundError();
  }

  if (room.Booking.length === room.capacity) {
    throw accessDeniedError();
  }

  return bookingRepository.createBooking(userId, roomId);
}

async function updateBooking(userId: number, bookingId: number, roomId: number): Promise<Booking> {
  await hasValidEnrollment(userId);

  if (!bookingId) {
    throw accessDeniedError();
  }

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

  if (room.Booking.length === room.capacity) {
    throw accessDeniedError();
  }

  const newBooking = await bookingRepository.createBooking(userId, roomId);
  await bookingRepository.deleteBookingById(bookingId);

  return newBooking;
}

async function hasValidEnrollment(userId: number): Promise<void> {
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
  roomId: number
}

const bookingsService = {
  getBookingByUser,
  updateBooking,
  postBooking
};

export default bookingsService;
