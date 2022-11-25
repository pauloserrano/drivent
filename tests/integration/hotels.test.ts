import supertest from "supertest";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import app from "@/app";
import { createEnrollmentWithAddress, createTicket, createUser, createInvalidTicketType, createValidTicketType, createHotel } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";
import { connectDb } from "@/config";
import { TicketStatus } from "@prisma/client";

const server = supertest(app);

beforeAll(async () => {
  connectDb();
  cleanDb();
});

describe("GET /hotels/:hotelId?", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = "lelecalvo";
    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid and has no hotel id", () => {
    it("should respond with status 404 if user has no enrollment yet", async () => {
      const token = await generateValidToken();
      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 if enrollment related ticket doesn't exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 402 if ticket isn't paid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createValidTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it("should respond with status 402 if ticket isn't paid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createInvalidTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 200 and hotels data", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createValidTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toBeDefined();
    });
  });

  describe("when token is valid and has hotel id", () => {
    it("should respond with status 404 if user has no enrollment yet", async () => {
      const hotel = await createHotel();
      const token = await generateValidToken();
      const response = await server.get(`/hotels/:${hotel.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 if given hotel id doesn't exist", async () => {
      const token = await generateValidToken();
      const response = await server.get("/hotels/0").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 if enrollment related ticket doesn't exist", async () => {
      const hotel = await createHotel();
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
      const response = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 402 if ticket isn't paid", async () => {
      const hotel = await createHotel();
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createValidTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it("should respond with status 402 if ticket isn't paid", async () => {
      const hotel = await createHotel();
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createInvalidTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 200 and hotels data", async () => {
      const hotel = await createHotel();
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createValidTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toBeDefined();
    });
  });
});

/*
GET /hotels/:hotelId?
    √ should respond with status 401 if no token is given
    √ should respond with status 401 if given token isn't valid
    √ should respond with status 401 if given token has no session

  When token is valid and no hotel id was given
      √ should respond with status 404 if user has no enrollment yet
      √ should respond with status 404 if enrollment related ticket doesn't exist
x should respond with status 401 if user doesn't own ticket
      √ should respond with status 402 if ticket isn't paid
      √ should respond with status 401 if ticket doesn't include hotel or is remote
      √ should respond with status 200 and hotel data

  When token is valid and hotel id was given
      - should respond with status 403 if user has no enrollment yet
      - should respond with status 404 if given hotel id doesn't exist
      - should respond with status 404 if enrollment related ticket doesn't exist
x should respond with status 401 if user doesn't own ticket
      - should respond with status 402 if ticket isn't paid
      - should respond with status 400 if ticket doesn't include hotel or is remote
      - should respond with status 200 and hotels data 
*/
