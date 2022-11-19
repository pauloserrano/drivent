import { prisma } from "@/config";
import { TicketType, Ticket } from "@prisma/client";

async function findTicketTypes(): Promise<TicketType[]> {
  return prisma.ticketType.findMany();
}

async function findTicketByEnrollmentId(enrollmentId: number): Promise<Ticket & { TicketType: TicketType }> {
  return prisma.ticket.findFirst({
    where: { enrollmentId },
    include: {
      TicketType: true
    },
  });
}

async function createTicket(data: Omit<Ticket, "id" | "createdAt">): Promise<Ticket> {
  return prisma.ticket.create({ 
    data,
    include: {
      TicketType: true
    } 
  });
}

const ticketsRepository = {
  findTicketTypes,
  findTicketByEnrollmentId,
  createTicket
};
  
export default ticketsRepository;
