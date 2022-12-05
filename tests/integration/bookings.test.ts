import supertest from "supertest";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import { TicketStatus } from "@prisma/client";
import app from "@/app";
import { prisma, connectDb } from "@/config";
import { cleanDb, generateValidToken } from "../helpers";
import { 
  createEnrollmentWithAddress, 
  createTicket, 
  createUser, 
  createInvalidTicketType, 
  createValidTicketType, 
  createRoom, 
  createBooking, 
  createFilledRoom 
} from "../factories";

const server = supertest(app);

beforeAll(async () => {
  connectDb();
  cleanDb();
});

describe("GET /booking", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/booking");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token isn't valid", async () => {
    const response = await server.get("/booking").set("Authorization", "notthis");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token has no related session", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 if user has no booking", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createValidTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
     
    it("should respond with status 200 and booking data", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createValidTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const room = await createRoom();
      const booking = await createBooking(user, room);

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual({
        id: booking.id,
        Room: {
          ...room,
          createdAt: room.createdAt.toISOString(),
          updatedAt: room.updatedAt.toISOString()
        }
      });
    });
  });
});

describe("POST /booking", () => {
  it("should respond with status 401 if no token is given", async () => {
    const room = await createRoom();
    const body = { roomId: room.id };
    const response = await server.post("/booking").send(body);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token isn't valid", async () => {
    const token = "lelecalvo";
    const room = await createRoom();
    const body = { roomId: room.id };
    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token has no related session", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const room = await createRoom();
    const body = { roomId: room.id };
    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 400 if request has no body", async () => {
      const token = await generateValidToken();
      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 if request body is invalid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createValidTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const body = { roomId: "notright" };

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });

    describe("when body is valid", () => {
      it("should respond with status 403 if user has no enrollment", async () => {
        const token = await generateValidToken();
        const room = await createRoom();
        const body = { roomId: room.id };
        const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);
  
        expect(response.status).toEqual(httpStatus.FORBIDDEN);
      });
  
      it("should respond with status 403 if enrollment has no related ticket", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        await createEnrollmentWithAddress(user);
        const room = await createRoom();
        const body = { roomId: room.id };
        const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);
  
        expect(response.status).toEqual(httpStatus.FORBIDDEN);
      });
  
      it("should respond with status 403 if ticket isn't paid", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createValidTicketType();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
  
        const room = await createRoom();
        const body = { roomId: room.id };
        const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);
  
        expect(response.status).toEqual(httpStatus.FORBIDDEN);
      });
      
      it("should respond with status 403 if ticket doesn't include hotel or is remote", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createInvalidTicketType();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
  
        const room = await createRoom();
        const body = { roomId: room.id };
        const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);
  
        expect(response.status).toEqual(httpStatus.FORBIDDEN);
      });
  
      it("should respond with status 404 if given room does not exist", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createValidTicketType();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const body = { roomId: -1 };
  
        const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);
  
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
      });

      it("should respond with status 403 if given room has no space remaining", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createValidTicketType();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        const room = await createFilledRoom();
        const body = { roomId: room.id };
  
        const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);
  
        expect(response.status).toEqual(httpStatus.FORBIDDEN);
      });
       
      it("should respond with status 200 and booking id", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createValidTicketType();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const room = await createRoom();

        const body = { roomId: room.id };
        const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);
        expect(response.status).toEqual(httpStatus.OK);
        expect(response.body).toEqual({
          bookingId: response.body.bookingId
        });

        const newBooking = await prisma.booking.findFirst({ where: { id: response.body.bookingId } });
        expect(newBooking).toEqual(expect.objectContaining({
          roomId: body.roomId,
          userId: user.id
        }));
      });
    });
  });
});

describe("PUT /booking/:bookingId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const user = await createUser();
    const room = await createRoom();
    const body = { roomId: room.id };
    const booking = await createBooking(user);
    const response = await server.put(`/booking/${booking.id}`).send(body);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token isn't valid", async () => {
    const user = await createUser();
    const room = await createRoom();
    const body = { roomId: room.id };
    const booking = await createBooking(user);
    const response = await server.put(`/booking/${booking.id}`).set("Authorization", "notthis").send(body);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token has no related session", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const room = await createRoom();
    const body = { roomId: room.id };
    const booking = await createBooking(userWithoutSession);
    const response = await server.put(`/booking/${booking.id}`).set("Authorization", `Bearer ${token}`).send(body);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 400 if request has no body", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const booking = await createBooking(user);
      const response = await server.put(`/booking/${booking.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 if request body is invalid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createValidTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const body = { roomId: "notright" };

      const booking = await createBooking(user);
      const response = await server.put(`/booking/${booking.id}`).set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });

    describe("when body is valid", () => {
      it("should respond with status 403 if given booking does not exist", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createValidTicketType();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        const room = await createRoom();
        const body = { roomId: room.id };

        const response = await server.put("/booking/-1").set("Authorization", `Bearer ${token}`).send(body);

        expect(response.status).toEqual(httpStatus.FORBIDDEN);
      });

      it("should respond with status 403 if user does not own given booking", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createValidTicketType();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        const room = await createRoom();
        const body = { roomId: room.id };
        const booking = await createBooking(await createUser());

        const response = await server.put(`/booking/${booking.id}`).set("Authorization", `Bearer ${token}`).send(body);

        expect(response.status).toEqual(httpStatus.FORBIDDEN);
      });
  
      it("should respond with status 404 if given room does not exist", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createValidTicketType();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const body = { roomId: -1 };
  
        const booking = await createBooking(user);
        const response = await server.put(`/booking/${booking.id}`).set("Authorization", `Bearer ${token}`).send(body);
  
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
      });

      it("should respond with status 403 if given room has no space remaining", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createValidTicketType();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        const room = await createFilledRoom();
        const body = { roomId: room.id };
  
        const booking = await createBooking(user);
        const response = await server.put(`/booking/${booking.id}`).set("Authorization", `Bearer ${token}`).send(body);
  
        expect(response.status).toEqual(httpStatus.FORBIDDEN);
      });
       
      it("should respond with status 200 and booking id", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createValidTicketType();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const room = await createRoom();
        const booking = await createBooking(user);

        const body = { roomId: room.id };
        const response = await server.put(`/booking/${booking.id}`).set("Authorization", `Bearer ${token}`).send(body);
  
        expect(response.status).toEqual(httpStatus.OK);
        expect(response.body).toEqual({ bookingId: booking.id });

        const updatedBooking = await prisma.booking.findFirst({ where: { id: response.body.bookingId } });
        expect(updatedBooking).toEqual(expect.objectContaining({
          roomId: body.roomId,
          userId: user.id
        }));
      });
    });
  });
});
