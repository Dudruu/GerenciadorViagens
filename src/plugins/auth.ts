import fp from "fastify-plugin";
import { FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";
import { UnauthorizedError } from "../errors/app-error";

const authPlugin: FastifyPluginAsync = fp(async (app) => {
  app.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch {
      throw new UnauthorizedError("Authentication token is missing or invalid");
    }
  });
});

export default authPlugin;
