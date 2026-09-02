import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import {
  createTripSchema,
  updateTrip,
  tripResponseSchema,
  tripParamsSchema,
} from "../schemas/trip.schema";
import { errorResponseSchema } from "../schemas/commun.schema";
import { checkTripAccess } from "../utils/trip-acess";

export const tripRoutes: FastifyPluginAsyncZod = async (app) => {
  
  app.post(
    "/",
    {
      preHandler: [app.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        body: createTripSchema,
        response: { 201: tripResponseSchema },
      },
    },
    async (request, reply) => {
      const userId = request.user.userId;

      const trip = await app.prisma.trip.create({
        data: {
          ...request.body,
          userId,
        },
      });
      return reply.status(201).send(trip);
    }
  );


  app.get(
    "/:id",
    {
      preHandler: [app.authenticate],
      schema: {
        security: [{ bearerAuth: [] }], 
        params: tripParamsSchema,
        response: { 200: tripResponseSchema, 404: errorResponseSchema },
      },
    },
    async (request, reply) => {
      const userId = request.user.userId;
      const { id } = request.params;

      const { trip, allowed } = await checkTripAccess(
        app.prisma,
        id,
        userId,
        "read"
      );

      if (!trip || !allowed) {
        return reply.status(404).send({ message: "Viagem não encontrada" });
      }

      return trip;
    }
  );

  
  app.get(
    "/",
    {
      preHandler: [app.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        response: { 200: z.array(tripResponseSchema) }, 
      },
    },
    async (request) => {
      const userId = request.user.userId;

      return app.prisma.trip.findMany({
        where: { userId },
        orderBy: { startDate: "desc" },
      });
    }
  );

 
  app.patch(
    "/:id",
    {
      preHandler: [app.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        params: tripParamsSchema,
        body: updateTrip,
        response: { 200: tripResponseSchema, 404: errorResponseSchema },
      },
    },
    async (request, reply) => {
      const userId = request.user.userId;
      const { id } = request.params;
      
      const { trip, allowed } = await checkTripAccess(app.prisma, id, userId, "write");
      
      if (!trip || !allowed) {
        return reply.status(404).send({ message: "Trip not found!" });
      }

      const updated = await app.prisma.trip.update({
        where: { id },
        data: request.body,
      });

      return updated;
    }
  );


  app.delete(
    "/:id",
    {
      preHandler: [app.authenticate],
      schema: { 
        security: [{ bearerAuth: [] }], 
        params: tripParamsSchema, 
        response: { 204: z.null(), 404: errorResponseSchema } 
      },
    },
    async (request, reply) => {
      const userId = request.user.userId;
      const { id } = request.params;

      const trip = await app.prisma.trip.findFirst({
        where: { id, userId }, 
      });

      if (!trip) {
        return reply.status(404).send({ message: "Trip not found!" });
      }

      await app.prisma.trip.delete({ where: { id } });
      return reply.status(204).send(null);
    }
  );
};