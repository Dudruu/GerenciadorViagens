import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { TripController } from "../controllers/trip.controller";
import {
  createTripSchema,
  updateTripSchema,
  tripResponseSchema,
  tripParamsSchema,
} from "../schemas/trip.schema";
import { errorResponseSchema } from "../schemas/common.schema";

export const tripRoutes: FastifyPluginAsyncZod = async (app) => {
  // All trip endpoints require authentication
  app.addHook("preHandler", app.authenticate);

  app.post(
    "/",
    {
      schema: {
        tags: ["Trips"],
        summary: "Create a new trip",
        security: [{ bearerAuth: [] }],
        body: createTripSchema,
        response: {
          201: tripResponseSchema,
          400: errorResponseSchema,
          401: errorResponseSchema,
        },
      },
    },
    TripController.create
  );

  app.get(
    "/",
    {
      schema: {
        tags: ["Trips"],
        summary: "List current user's trips",
        security: [{ bearerAuth: [] }],
        response: {
          200: z.array(tripResponseSchema),
          401: errorResponseSchema,
        },
      },
    },
    TripController.list
  );

  app.get(
    "/:id",
    {
      schema: {
        tags: ["Trips"],
        summary: "Get trip details by ID",
        security: [{ bearerAuth: [] }],
        params: tripParamsSchema,
        response: {
          200: tripResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    TripController.getById
  );

  app.patch(
    "/:id",
    {
      schema: {
        tags: ["Trips"],
        summary: "Update an existing trip",
        security: [{ bearerAuth: [] }],
        params: tripParamsSchema,
        body: updateTripSchema,
        response: {
          200: tripResponseSchema,
          400: errorResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    TripController.update
  );

  app.delete(
    "/:id",
    {
      schema: {
        tags: ["Trips"],
        summary: "Delete a trip",
        security: [{ bearerAuth: [] }],
        params: tripParamsSchema,
        response: {
          204: z.null().describe("Trip deleted successfully"),
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    TripController.delete
  );
};
