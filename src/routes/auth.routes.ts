import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { AuthController } from "../controllers/auth.controller";
import {
  registerSchema,
  loginSchema,
  authResponseSchema,
  userProfileResponseSchema,
} from "../schemas/auth.schema";
import { errorResponseSchema } from "../schemas/common.schema";

export const authRoutes: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/register",
    {
      schema: {
        tags: ["Auth"],
        summary: "Register new user",
        description: "Creates a new user account with hashed password and returns a JWT token.",
        body: registerSchema,
        response: {
          201: authResponseSchema,
          400: errorResponseSchema,
          409: errorResponseSchema,
        },
      },
    },
    AuthController.register
  );

  app.post(
    "/login",
    {
      schema: {
        tags: ["Auth"],
        summary: "User login",
        description: "Authenticates user credentials and returns a JWT token.",
        body: loginSchema,
        response: {
          200: authResponseSchema,
          400: errorResponseSchema,
          401: errorResponseSchema,
        },
      },
    },
    AuthController.login
  );

  app.get(
    "/me",
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ["Auth"],
        summary: "Current user profile",
        description: "Returns the authenticated user's profile.",
        security: [{ bearerAuth: [] }],
        response: {
          200: userProfileResponseSchema,
          401: errorResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    AuthController.me
  );
};
