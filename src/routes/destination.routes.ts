import z from "zod";
import { errorResponseSchema } from "../schemas/commun.schema";
import { createDestinationSchema, destinationParams, destinationResponseSchema, updateDestination } from "../schemas/destination.schema";
import { checkTripAccess } from "../utils/trip-acess";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const destinationRoutes: FastifyPluginAsyncZod = async (app) => {

  // Criar destino
  app.post(
    "/:tripId/destination",
    {
      preHandler: [app.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        params: destinationParams,
        body: createDestinationSchema,
        response: { 201: destinationResponseSchema, 403: errorResponseSchema },
      },
    },
    async (request, reply) => {
      const userId = request.user.userId;
      const { tripId } = request.params;

      const { allowed } = await checkTripAccess(app.prisma, tripId, userId, "write");
      if (!allowed) {
        return reply.status(403).send({ message: "Dont have permission" });
      }

      const destination = await app.prisma.destination.create({
        data: { ...request.body, tripId },
      });

      return reply.status(201).send(destination);
    }
  );

  // Listar destinos
  app.get(
    "/:tripId/destination",
    {
      preHandler: [app.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        params: destinationParams,
        response: { 200: z.array(destinationResponseSchema), 403: errorResponseSchema },
      },
    },
    async (request, reply) => {
      const userId = request.user.userId;
      const { tripId } = request.params;

      const { allowed } = await checkTripAccess(app.prisma, tripId, userId, "read");
      if (!allowed) {
        return reply.status(403).send({ message: "Dont have permission" });
      }

      return app.prisma.destination.findMany({
        where: { tripId },
        orderBy: { order: "asc" },
      });
    }
  );

  // Buscar um destino
  app.get(
    "/:tripId/destination/:id",
    {
      preHandler: [app.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        params: destinationParams,
        response: { 200: destinationResponseSchema, 403: errorResponseSchema, 404: errorResponseSchema },
      },
    },
    async (request, reply) => {
      const userId = request.user.userId;
      const { tripId, id } = request.params;

      const { allowed } = await checkTripAccess(app.prisma, tripId, userId, "read");
      if (!allowed) {
        return reply.status(403).send({ message: "Dont have permission" });
      }

      const destination = await app.prisma.destination.findFirst({
        where: { id, tripId },
      });

      if (!destination) {
        return reply.status(404).send({ message: "Destination not found" });
      }

      return destination;
    }
  );

  // Atualizar destino
  app.patch(
    "/:tripId/destination/:id",
    {
      preHandler: [app.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        params: destinationParams,
        body: updateDestination,
        response: { 200: destinationResponseSchema, 403: errorResponseSchema, 404: errorResponseSchema },
      },
    },
    async (request, reply) => {
      const userId = request.user.userId;
      const { tripId, id } = request.params;

      const { allowed } = await checkTripAccess(app.prisma, tripId, userId, "write");
      if (!allowed) {
        return reply.status(403).send({ message: "Dont have permission" });
      }

      const existing = await app.prisma.destination.findFirst({
        where: { id, tripId },
      });

      if (!existing) {
        return reply.status(404).send({ message: "Destination not found" });
      }

      const destination = await app.prisma.destination.update({
        where: { id },
        data: request.body,
      });

      return destination;
    }
  );

  // Deletar destino
  app.delete(
    "/:tripId/destination/:id",
    {
      preHandler: [app.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        params: destinationParams,
        response: { 204: z.null(), 403: errorResponseSchema, 404: errorResponseSchema },
      },
    },
    async (request, reply) => {
      const userId = request.user.userId;
      const { tripId, id } = request.params;

      const { allowed } = await checkTripAccess(app.prisma, tripId, userId, "write");
      if (!allowed) {
        return reply.status(403).send({ message: "Dont have permission" });
      }

      const existing = await app.prisma.destination.findFirst({
        where: { id, tripId },
      });

      if (!existing) {
        return reply.status(404).send({ message: "Destination not found" });
      }

      await app.prisma.destination.delete({ where: { id } });

      return reply.status(204).send(null);
    }
  );

};