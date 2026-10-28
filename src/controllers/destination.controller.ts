import { FastifyReply, FastifyRequest } from "fastify";
import { DestinationService } from "../services/destination.service";
import { CreateDestinationInput, UpdateDestinationInput } from "../schemas/destination.schema";

export class DestinationController {
  static async create(
    request: FastifyRequest<{
      Params: { tripId: string };
      Body: CreateDestinationInput;
    }>,
    reply: FastifyReply
  ) {
    const destinationService = new DestinationService(request.server.prisma);
    const destination = await destinationService.createDestination(
      request.params.tripId,
      request.user.userId,
      request.body
    );
    return reply.status(201).send(destination);
  }

  static async list(
    request: FastifyRequest<{ Params: { tripId: string } }>,
    reply: FastifyReply
  ) {
    const destinationService = new DestinationService(request.server.prisma);
    const destinations = await destinationService.listDestinations(
      request.params.tripId,
      request.user.userId
    );
    return reply.status(200).send(destinations);
  }

  static async getById(
    request: FastifyRequest<{ Params: { tripId: string; id: string } }>,
    reply: FastifyReply
  ) {
    const destinationService = new DestinationService(request.server.prisma);
    const destination = await destinationService.getDestinationById(
      request.params.tripId,
      request.params.id,
      request.user.userId
    );
    return reply.status(200).send(destination);
  }

  static async update(
    request: FastifyRequest<{
      Params: { tripId: string; id: string };
      Body: UpdateDestinationInput;
    }>,
    reply: FastifyReply
  ) {
    const destinationService = new DestinationService(request.server.prisma);
    const updated = await destinationService.updateDestination(
      request.params.tripId,
      request.params.id,
      request.user.userId,
      request.body
    );
    return reply.status(200).send(updated);
  }

  static async delete(
    request: FastifyRequest<{ Params: { tripId: string; id: string } }>,
    reply: FastifyReply
  ) {
    const destinationService = new DestinationService(request.server.prisma);
    await destinationService.deleteDestination(
      request.params.tripId,
      request.params.id,
      request.user.userId
    );
    return reply.status(204).send();
  }
}
