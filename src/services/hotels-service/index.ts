import { Hotel, TicketStatus } from "@prisma/client";
import hotelRepository from "@/repositories/hotel-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { notFoundError, unauthorizedError } from "@/errors";
import ticketsRepository from "@/repositories/tickets-repository";
import { ticketNotPaidError } from "./errors";

async function getHotels(userId: number) {
  const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) {
    throw notFoundError();
  }

  if (ticket.status !== TicketStatus.PAID) {
    throw ticketNotPaidError();
  }

  if (!ticket.TicketType.includesHotel || ticket.TicketType.isRemote) {
    throw unauthorizedError();
  }

  return hotelRepository.findHotels();
}

async function getHotelById(hotelId: number, userId: number): Promise<Hotel> {
  const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) {
    throw notFoundError();
  }

  if (ticket.status !== TicketStatus.PAID) {
    throw ticketNotPaidError();
  }

  if (!ticket.TicketType.includesHotel || ticket.TicketType.isRemote) {
    throw unauthorizedError();
  }

  return hotelRepository.findHotelById(hotelId);
}

const hotelsService = {
  getHotels,
  getHotelById
};

export default hotelsService;
