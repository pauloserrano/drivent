import { TicketStatus } from "@prisma/client";
import hotelRepository from "@/repositories/hotel-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import { paymentRequiredError, accessDeniedError } from "./errors";
import { notFoundError } from "@/errors";

async function getHotelData(userId: number, hotelId: string) {
  const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);
  if (!enrollment) {
    throw accessDeniedError();
  }

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) {
    throw accessDeniedError();
  }

  if (ticket.status !== TicketStatus.PAID) {
    throw paymentRequiredError();
  }

  if (!ticket.TicketType.includesHotel || ticket.TicketType.isRemote) {
    throw accessDeniedError();
  }

  if (!hotelId) {
    return hotelRepository.findHotels();
  }
  
  const hotel = await hotelRepository.findHotelById(+hotelId);
  if (!hotel) {
    throw notFoundError();
  }
  
  return hotel;
}

const hotelsService = {
  getHotelData,
};

export default hotelsService;
