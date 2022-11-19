import { ApplicationError } from "@/protocols";

export function invalidBody(): ApplicationError {
  return {
    name: "InvalidBody",
    message: "Expected 'ticketId' but got none",
  };
}
