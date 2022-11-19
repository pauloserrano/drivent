import { ApplicationError } from "@/protocols";

export function invalidBody(): ApplicationError {
  return {
    name: "InvalidBody",
    message: "Expected 'ticketTypeId' but got none",
  };
}
