import { ApplicationError } from "@/protocols";

export function accessDeniedError(): ApplicationError {
  return {
    name: "AccessDeniedError",
    message: "User cannot access this area yet",
  };
}

export function paymentRequiredError(): ApplicationError {
  return {
    name: "PaymentRequiredError",
    message: "No payment received yet",
  };
}
