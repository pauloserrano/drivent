import { prisma } from "@/config";
import { Payment } from "@prisma/client";

async function findPaymentByTicketId(ticketId: number): Promise<Payment> {
  return prisma.payment.findFirst({
    where: { ticketId }
  });
}

async function create(data: Omit<Payment, "id" | "createdAt">): Promise<Payment> {
  return prisma.payment.create({
    data
  });
}
  
const paymentsRepository = {
  findPaymentByTicketId,
  create
};
    
export default paymentsRepository;
