import { prisma } from "@/config";
import { TicketType, Ticket, Enrollment } from "@prisma/client";

async function findTicketTypes(): Promise<TicketType[]> {
  return prisma.ticketType.findMany();
}

async function findTicketById(id: number): Promise<Ticket & { Enrollment: Enrollment, TicketType: TicketType }> {
  return prisma.ticket.findFirst({
    where: { id },
    include: {
      Enrollment: true,
      TicketType: true
    },
  });
}

async function findTicketByEnrollmentId(enrollmentId: number): Promise<Ticket & { TicketType: TicketType }> {
  return prisma.ticket.findFirst({
    where: { enrollmentId },
    include: {
      TicketType: true
    },
  });
}

async function createTicket(data: Omit<Ticket, "id" | "createdAt">): Promise<Ticket & { TicketType: TicketType }> {
  return prisma.ticket.create({ 
    data,
    include: {
      TicketType: true
    } 
  });
}

async function updateTicket(data: Partial<Omit<Ticket, "id">>, id: number) {
  return prisma.ticket.update({
    where: { id },
    data
  });
}

const ticketsRepository = {
  findTicketTypes,
  findTicketById,
  findTicketByEnrollmentId,
  createTicket,
  updateTicket
};
  
export default ticketsRepository;
