import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "../services/auth.service";
import { RegisterInput, LoginInput } from "../schemas/auth.schema";

export class AuthController {
  static async register(
    request: FastifyRequest<{ Body: RegisterInput }>,
    reply: FastifyReply
  ) {
    const authService = new AuthService(request.server.prisma);
    const signToken = (payload: { userId: string }) => request.server.jwt.sign(payload);

    const result = await authService.register(request.body, signToken);
    return reply.status(201).send(result);
  }

  static async login(
    request: FastifyRequest<{ Body: LoginInput }>,
    reply: FastifyReply
  ) {
    const authService = new AuthService(request.server.prisma);
    const signToken = (payload: { userId: string }) => request.server.jwt.sign(payload);

    const result = await authService.login(request.body, signToken);
    return reply.status(200).send(result);
  }

  static async me(request: FastifyRequest, reply: FastifyReply) {
    const authService = new AuthService(request.server.prisma);
    const user = await authService.getProfile(request.user.userId);
    return reply.status(200).send(user);
  }
}
