import { ApplicationError } from "@/protocols";

export function cannotAccess(): ApplicationError {
  return {
    name: "CannotAccess",
    message: "Cannot see hotels before enrollment",
  };
}

export function ticketNotPaidError(): ApplicationError {
  return {
    name: "TicketNotPaidError",
    message: "Pay your rent",
  };
}
