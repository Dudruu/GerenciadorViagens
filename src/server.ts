import "dotenv/config";
import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import {
  validatorCompiler,
  serializerCompiler,
  jsonSchemaTransform,
  ZodTypeProvider,
} from "fastify-type-provider-zod";

import { env } from "./config/env";
import { errorHandler } from "./errors/error-handler";
import prismaPlugin from "./plugins/prisma";
import authPlugin from "./plugins/auth";
import appRoutes from "./routes/index";

export function buildServer() {
  const app = fastify({
    logger: env.NODE_ENV === "development",
  }).withTypeProvider<ZodTypeProvider>();

  // Centralized Error Handling
  app.setErrorHandler(errorHandler);

  // Zod Type Provider compilers
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // CORS Configuration
  app.register(fastifyCors, {
    origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });

  // JWT Configuration with validated Secret
  app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
  });

  // Database and Auth plugins
  app.register(prismaPlugin);
  app.register(authPlugin);

  // OpenAPI / Swagger Documentation
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Gerenciador de Viagens API",
        description: "API robusta e segura para gerenciamento de viagens, destinos e itinerários.",
        version: "1.0.0",
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "Insira o token JWT gerado no login/registro.",
          },
        },
      },
    },
    transform: jsonSchemaTransform,
  });

  app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
  });

  // Healthcheck Endpoint
  app.get(
    "/health",
    {
      schema: {
        tags: ["System"],
        summary: "API & Database Healthcheck",
        response: {
          200: {
            type: "object",
            properties: {
              status: { type: "string" },
              uptime: { type: "number" },
              timestamp: { type: "string" },
            },
          },
        },
      },
    },
    async () => {
      await app.prisma.$queryRaw`SELECT 1`;
      return {
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      };
    }
  );

  // Application Routes
  app.register(appRoutes);

  return app;
}

async function start() {
  const server = buildServer();

  try {
    await server.listen({
      port: env.PORT,
      host: env.HOST,
    });
    console.log(`🚀 Server running on http://${env.HOST}:${env.PORT}`);
    console.log(`📚 Swagger documentation available at http://${env.HOST}:${env.PORT}/docs`);
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }

  // Graceful shutdown handling
  const signals = ["SIGINT", "SIGTERM"];
  for (const signal of signals) {
    process.on(signal, async () => {
      console.log(`\nReceived ${signal}, shutting down gracefully...`);
      await server.close();
      process.exit(0);
    });
  }
}

if (process.env.NODE_ENV !== "test") {
  start();
}
