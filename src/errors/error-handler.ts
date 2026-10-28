import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { AppError } from "./app-error";
import { env } from "../config/env";

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Zod validation errors
  if (error instanceof ZodError) {
    return reply.status(400).send({
      statusCode: 400,
      error: "Validation Error",
      message: "Validation failed",
      issues: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  // Fastify schema validation errors
  if (error.validation) {
    return reply.status(400).send({
      statusCode: 400,
      error: "Bad Request",
      message: error.message,
    });
  }

  // Domain AppErrors
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      message: error.message,
    });
  }

  // Fastify JWT errors
  if (error.statusCode === 401 || error.message.includes("jwt") || error.message.includes("authorization")) {
    return reply.status(401).send({
      statusCode: 401,
      message: "Invalid or expired token",
    });
  }

  // Prisma unique constraint error
  if ((error as any).code === "P2002") {
    return reply.status(409).send({
      statusCode: 409,
      message: "A resource with this data already exists",
    });
  }

  // Log unhandled server errors
  request.log.error(error);

  // Avoid leaking internal errors in production
  return reply.status(500).send({
    statusCode: 500,
    message: env.NODE_ENV === "production" ? "Internal server error" : error.message,
  });
}
