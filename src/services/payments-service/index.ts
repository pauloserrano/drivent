import paymentsRepository from "@/repositories/payments-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import { notFoundError, unauthorizedError } from "@/errors";
import { invalidBody } from "./errors";

async function getPayment(params: paymentParams) {
  if (!params.ticketId) throw invalidBody();

  const ticket = await ticketsRepository.findTicketById(params.ticketId);
  if (!ticket) throw notFoundError();
  if (ticket.Enrollment.userId !== params.userId) throw unauthorizedError();

  const payment = await paymentsRepository.findPaymentByTicketId(params.ticketId);
  if (!payment) throw notFoundError();

  return payment;
}

async function postPayment(params: newPayment, userId: number) {
  const ticket = await ticketsRepository.findTicketById(params.ticketId);
  if (!ticket) throw notFoundError();
  if (ticket.Enrollment.userId !== userId) throw unauthorizedError();

  await ticketsRepository.updateTicket({ status: "PAID" }, params.ticketId);

  return paymentsRepository.create({
    ticketId: params.ticketId,
    value: ticket.TicketType.price,
    cardIssuer: params.cardData.issuer,
    cardLastDigits: `${params.cardData.number}`.slice(-4),
    updatedAt: new Date()
  });
}

export type paymentParams = {
    ticketId: number,
    userId: number
}

export type newPayment = {
    ticketId: number,
	cardData: {
        issuer: string,
        number: number,
        name: string,
        expirationDate: Date,
        cvv: number
    }
}

const paymentsService = {
  getPayment,
  postPayment
};
  
export default paymentsService;
