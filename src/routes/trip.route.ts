import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import {
  createTripSchema,
  updateTrip,
  tripResponseSchema,
  tripParamsSchema,
} from "../schemas/trip.schema";
import { errorResponseSchema } from "../schemas/commun.schema";

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
    },
  );

  app.get(
    "/",
    {
      preHandler: [app.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        response: { 201: z.array(tripResponseSchema) },
      },
    },

    async (request) => {
      const userId = request.user.userId;

      return app.prisma.trip.findMany({
        where: { userId },
        orderBy: { startDate: "desc" },
      });
    },
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

      const existingTrip = await app.prisma.trip.findUnique({
        where: { id, userId },
      });

      if (!existingTrip) {
        return reply.status(404).send({ message: " Trip doesn't exist!" });
      }

      const trip = await app.prisma.trip.update({
        where: { id },
        data: request.body,
      });

      return trip;
    },
  );

  app.delete(
    "/:id",
    {
      preHandler: [app.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        params: tripParamsSchema,
        response: { 204: z.null(), 404: errorResponseSchema },
      },
    },

    async (request, reply) => {
      const userId = request.user.userId;
      const { id } = request.params;

      const existingTrip = await app.prisma.trip.findFirst({
        where: { id, userId },
      });

      if (!existingTrip) {
        return reply.status(404).send({ message: "The trip doesn't exists." });
      }

      await app.prisma.trip.delete({

        where: { id },
      });

      return reply.status(204).send(null); 
    },
  );
};
