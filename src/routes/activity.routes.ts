import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { ActivityController } from "../controllers/activity.controller";
import {
  createActivitySchema,
  updateActivitySchema,
  activityResponseSchema,
  activityListParamsSchema,
  activityDetailParamsSchema,
} from "../schemas/activity.schema";
import { errorResponseSchema } from "../schemas/common.schema";

export const activityRoutes: FastifyPluginAsyncZod = async (app) => {
  // All activity endpoints require authentication
  app.addHook("preHandler", app.authenticate);

  const registerRoutes = (destPrefix: string, actPrefix: string) => {
    app.post(
      `/:tripId/${destPrefix}/:destinationId/${actPrefix}`,
      {
        schema: {
          tags: ["Activities"],
          summary: "Create activity for a destination",
          security: [{ bearerAuth: [] }],
          params: activityListParamsSchema,
          body: createActivitySchema,
          response: {
            201: activityResponseSchema,
            400: errorResponseSchema,
            401: errorResponseSchema,
            403: errorResponseSchema,
            404: errorResponseSchema,
          },
        },
      },
      ActivityController.create
    );

    app.get(
      `/:tripId/${destPrefix}/:destinationId/${actPrefix}`,
      {
        schema: {
          tags: ["Activities"],
          summary: "List activities for a destination",
          security: [{ bearerAuth: [] }],
          params: activityListParamsSchema,
          response: {
            200: z.array(activityResponseSchema),
            401: errorResponseSchema,
            403: errorResponseSchema,
            404: errorResponseSchema,
          },
        },
      },
      ActivityController.list
    );

    app.get(
      `/:tripId/${destPrefix}/:destinationId/${actPrefix}/:id`,
      {
        schema: {
          tags: ["Activities"],
          summary: "Get activity details",
          security: [{ bearerAuth: [] }],
          params: activityDetailParamsSchema,
          response: {
            200: activityResponseSchema,
            401: errorResponseSchema,
            403: errorResponseSchema,
            404: errorResponseSchema,
          },
        },
      },
      ActivityController.getById
    );

    app.patch(
      `/:tripId/${destPrefix}/:destinationId/${actPrefix}/:id`,
      {
        schema: {
          tags: ["Activities"],
          summary: "Update activity",
          security: [{ bearerAuth: [] }],
          params: activityDetailParamsSchema,
          body: updateActivitySchema,
          response: {
            200: activityResponseSchema,
            400: errorResponseSchema,
            401: errorResponseSchema,
            403: errorResponseSchema,
            404: errorResponseSchema,
          },
        },
      },
      ActivityController.update
    );

    app.delete(
      `/:tripId/${destPrefix}/:destinationId/${actPrefix}/:id`,
      {
        schema: {
          tags: ["Activities"],
          summary: "Delete activity",
          security: [{ bearerAuth: [] }],
          params: activityDetailParamsSchema,
          response: {
            204: z.null().describe("Activity deleted successfully"),
            401: errorResponseSchema,
            403: errorResponseSchema,
            404: errorResponseSchema,
          },
        },
      },
      ActivityController.delete
    );
  };

  registerRoutes("destinations", "activities");
  registerRoutes("destination", "activity");
};
