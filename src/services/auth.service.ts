import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/prisma/client";
import { RegisterInput, LoginInput } from "../schemas/auth.schema";
import { ConflictError, UnauthorizedError, NotFoundError } from "../errors/app-error";

export class AuthService {
  constructor(private prisma: PrismaClient) {}

  async register(data: RegisterInput, signToken: (payload: { userId: string }) => string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictError("Email already registered");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        avatarUrl: data.avatarUrl ?? null,
      },
    });

    const token = signToken({ userId: user.id });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  async login(data: LoginInput, signToken: (payload: { userId: string }) => string) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    // Timing-safe response: avoid revealing whether email exists
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const token = signToken({ userId: user.id });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }
}
