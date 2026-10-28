import { FastifyReply, FastifyRequest } from "fastify";
import { TripService } from "../services/trip.service";
import { CreateTripInput, UpdateTripInput } from "../schemas/trip.schema";

export class TripController {
  static async create(
    request: FastifyRequest<{ Body: CreateTripInput }>,
    reply: FastifyReply
  ) {
    const tripService = new TripService(request.server.prisma);
    const trip = await tripService.createTrip(request.user.userId, request.body);
    return reply.status(201).send(trip);
  }

  static async list(request: FastifyRequest, reply: FastifyReply) {
    const tripService = new TripService(request.server.prisma);
    const trips = await tripService.listUserTrips(request.user.userId);
    return reply.status(200).send(trips);
  }

  static async getById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const tripService = new TripService(request.server.prisma);
    const trip = await tripService.getTripById(request.params.id, request.user.userId);
    return reply.status(200).send(trip);
  }

  static async update(
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateTripInput }>,
    reply: FastifyReply
  ) {
    const tripService = new TripService(request.server.prisma);
    const updated = await tripService.updateTrip(
      request.params.id,
      request.user.userId,
      request.body
    );
    return reply.status(200).send(updated);
  }

  static async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const tripService = new TripService(request.server.prisma);
    await tripService.deleteTrip(request.params.id, request.user.userId);
    return reply.status(204).send();
  }
}
