import ticketsRepository from "@/repositories/tickets-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { notFoundError } from "@/errors";
import { invalidBody } from "./errors";

async function getTicketTypes() {
  return ticketsRepository.findTicketTypes();
}

async function getTicketByUser(userId: number) {
  const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();
  
  return ticket;
}

async function setTicket(params: newTicketParams) {
  if (!params.ticketTypeId) throw invalidBody();

  const enrollment = await enrollmentRepository.findEnrollmentByUserId(params.userId);
  if (!enrollment) throw notFoundError();

  return ticketsRepository.createTicket({
    ticketTypeId: params.ticketTypeId,
    enrollmentId: enrollment.id,
    status: "RESERVED",
    updatedAt: new Date()
  });
  // TODO create new ticket
}

export type newTicketParams = {
  userId: number,
  ticketTypeId: number
}

const ticketsService = {
  getTicketTypes,
  getTicketByUser,
  setTicket
};
  
export default ticketsService;
