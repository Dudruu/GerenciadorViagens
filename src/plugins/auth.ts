
import fp from "fastify-plugin";
import { FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";

const authPlugin: FastifyPluginAsync = fp(async (app) => {
  app.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ message: "Não autorizado" });
    }
  });
});

export default authPlugin;