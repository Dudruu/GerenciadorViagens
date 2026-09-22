// src/routes/activity.routes.ts
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import {
  createActivitySchema,
  updateActivitySchema,
  activityResponseSchema,
  activityParams,
} from "../schemas/activy.schema
import { errorResponseSchema } from "../schemas/commun.schema";
import { checkTripAccess } from "../utils/trip-acess";
import { checkDestinationBelongsToTrip } from "../utils/destination-access";

export const activityRoutes: FastifyPluginAsyncZod = async (app) => {

  // Criar atividade
  app.post(
    "/:tripId/destination/:destinationId/activity",
    {
      preHandler: [app.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        params: activityParams,
        body: createActivitySchema,
        response: { 201: activityResponseSchema, 403: errorResponseSchema, 404: errorResponseSchema },
      },
    },
    async (request, reply) => {
      const userId = request.user.userId;
      const { tripId, destinationId } = request.params;

      const { allowed } = await checkTripAccess(app.prisma, tripId, userId, "write");
      if (!allowed) {
        return reply.status(403).send({ message: "Dont have permission" });
      }

      const destination = await checkDestinationBelongsToTrip(app.prisma, tripId, destinationId);
      if (!destination) {
        return reply.status(404).send({ message: "Destination not found" });
      }

      const activity = await app.prisma.activity.create({
        data: { ...request.body, destinationId },
      });

      return reply.status(201).send(activity);
    }
  );

  // Listar atividades de um destino
  app.get(
    "/:tripId/destination/:destinationId/activity",
    {
      preHandler: [app.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        params: activityParams,
        response: { 200: z.array(activityResponseSchema), 403: errorResponseSchema, 404: errorResponseSchema },
      },
    },
    async (request, reply) => {
      const userId = request.user.userId;
      const { tripId, destinationId } = request.params;

      const { allowed } = await checkTripAccess(app.prisma, tripId, userId, "read");
      if (!allowed) {
        return reply.status(403).send({ message: "Dont have permission" });
      }

      const destination = await checkDestinationBelongsToTrip(app.prisma, tripId, destinationId);
      if (!destination) {
        return reply.status(404).send({ message: "Destination not found" });
      }

      return app.prisma.activity.findMany({
        where: { destinationId },
        orderBy: { date: "asc" },
      });
    }
  );

  // Buscar uma atividade específica
  app.get(
    "/:tripId/destination/:destinationId/activity/:id",
    {
      preHandler: [app.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        params: activityParams,
        response: { 200: activityResponseSchema, 403: errorResponseSchema, 404: errorResponseSchema },
      },
    },
    async (request, reply) => {
      const userId = request.user.userId;
      const { tripId, destinationId, id } = request.params;

      const { allowed } = await checkTripAccess(app.prisma, tripId, userId, "read");
      if (!allowed) {
        return reply.status(403).send({ message: "Dont have permission" });
      }

      const destination = await checkDestinationBelongsToTrip(app.prisma, tripId, destinationId);
      if (!destination) {
        return reply.status(404).send({ message: "Destination not found" });
      }

      const activity = await app.prisma.activity.findFirst({
        where: { id, destinationId },
      });

      if (!activity) {
        return reply.status(404).send({ message: "Activity not found" });
      }

      return activity;
    }
  );

  // Atualizar atividade
  app.patch(
    "/:tripId/destination/:destinationId/activity/:id",
    {
      preHandler: [app.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        params: activityParams,
        body: updateActivitySchema,
        response: { 200: activityResponseSchema, 403: errorResponseSchema, 404: errorResponseSchema },
      },
    },
    async (request, reply) => {
      const userId = request.user.userId;
      const { tripId, destinationId, id } = request.params;

      const { allowed } = await checkTripAccess(app.prisma, tripId, userId, "write");
      if (!allowed) {
        return reply.status(403).send({ message: "Dont have permission" });
      }

      const destination = await checkDestinationBelongsToTrip(app.prisma, tripId, destinationId);
      if (!destination) {
        return reply.status(404).send({ message: "Destination not found" });
      }

      const existing = await app.prisma.activity.findFirst({
        where: { id, destinationId },
      });

      if (!existing) {
        return reply.status(404).send({ message: "Activity not found" });
      }

      const activity = await app.prisma.activity.update({
        where: { id },
        data: request.body,
      });

      return activity;
    }
  );

  // Deletar atividade
  app.delete(
    "/:tripId/destination/:destinationId/activity/:id",
    {
      preHandler: [app.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        params: activityParams,
        response: { 204: z.null(), 403: errorResponseSchema, 404: errorResponseSchema },
      },
    },
    async (request, reply) => {
      const userId = request.user.userId;
      const { tripId, destinationId, id } = request.params;

      const { allowed } = await checkTripAccess(app.prisma, tripId, userId, "write");
      if (!allowed) {
        return reply.status(403).send({ message: "Dont have permission" });
      }

      const destination = await checkDestinationBelongsToTrip(app.prisma, tripId, destinationId);
      if (!destination) {
        return reply.status(404).send({ message: "Destination not found" });
      }

      const existing = await app.prisma.activity.findFirst({
        where: { id, destinationId },
      });

      if (!existing) {
        return reply.status(404).send({ message: "Activity not found" });
      }

      await app.prisma.activity.delete({ where: { id } });

      return reply.status(204).send(null);
    }
  );

};