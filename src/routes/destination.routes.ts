import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { DestinationController } from "../controllers/destination.controller";
import {
  createDestinationSchema,
  updateDestinationSchema,
  destinationResponseSchema,
  destinationTripParamsSchema,
  destinationDetailParamsSchema,
} from "../schemas/destination.schema";
import { errorResponseSchema } from "../schemas/common.schema";

export const destinationRoutes: FastifyPluginAsyncZod = async (app) => {
  // All destination endpoints require authentication
  app.addHook("preHandler", app.authenticate);

  // Helper route registrar for both plural and singular endpoints
  const registerRoutes = (pathPrefix: string) => {
    app.post(
      `/:tripId/${pathPrefix}`,
      {
        schema: {
          tags: ["Destinations"],
          summary: "Create destination for a trip",
          security: [{ bearerAuth: [] }],
          params: destinationTripParamsSchema,
          body: createDestinationSchema,
          response: {
            201: destinationResponseSchema,
            400: errorResponseSchema,
            401: errorResponseSchema,
            403: errorResponseSchema,
            404: errorResponseSchema,
          },
        },
      },
      DestinationController.create
    );

    app.get(
      `/:tripId/${pathPrefix}`,
      {
        schema: {
          tags: ["Destinations"],
          summary: "List destinations of a trip",
          security: [{ bearerAuth: [] }],
          params: destinationTripParamsSchema,
          response: {
            200: z.array(destinationResponseSchema),
            401: errorResponseSchema,
            403: errorResponseSchema,
            404: errorResponseSchema,
          },
        },
      },
      DestinationController.list
    );

    app.get(
      `/:tripId/${pathPrefix}/:id`,
      {
        schema: {
          tags: ["Destinations"],
          summary: "Get destination details",
          security: [{ bearerAuth: [] }],
          params: destinationDetailParamsSchema,
          response: {
            200: destinationResponseSchema,
            401: errorResponseSchema,
            403: errorResponseSchema,
            404: errorResponseSchema,
          },
        },
      },
      DestinationController.getById
    );

    app.patch(
      `/:tripId/${pathPrefix}/:id`,
      {
        schema: {
          tags: ["Destinations"],
          summary: "Update destination",
          security: [{ bearerAuth: [] }],
          params: destinationDetailParamsSchema,
          body: updateDestinationSchema,
          response: {
            200: destinationResponseSchema,
            400: errorResponseSchema,
            401: errorResponseSchema,
            403: errorResponseSchema,
            404: errorResponseSchema,
          },
        },
      },
      DestinationController.update
    );

    app.delete(
      `/:tripId/${pathPrefix}/:id`,
      {
        schema: {
          tags: ["Destinations"],
          summary: "Delete destination",
          security: [{ bearerAuth: [] }],
          params: destinationDetailParamsSchema,
          response: {
            204: z.null().describe("Destination deleted successfully"),
            401: errorResponseSchema,
            403: errorResponseSchema,
            404: errorResponseSchema,
          },
        },
      },
      DestinationController.delete
    );
  };

  registerRoutes("destinations");
  registerRoutes("destination");
};
