import { PrismaClient } from "../generated/prisma/client";
import { CreateTripInput, UpdateTripInput } from "../schemas/trip.schema";
import { ForbiddenError, NotFoundError } from "../errors/app-error";

export type AccessLevel = "read" | "write";

export class TripService {
  constructor(private prisma: PrismaClient) {}

  async checkAccess(tripId: string, userId: string, level: AccessLevel = "read") {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        collaborators: {
          where: { userId },
        },
      },
    });

    if (!trip) {
      throw new NotFoundError("Trip not found");
    }

    const isOwner = trip.userId === userId;
    if (isOwner) {
      return trip;
    }

    const collaborator = trip.collaborators[0];
    if (!collaborator || !collaborator.acceptedAt) {
      throw new ForbiddenError("You do not have permission to access this trip");
    }

    if (level === "read") {
      return trip;
    }

    const canWrite = collaborator.role === "EDITOR" || collaborator.role === "OWNER";
    if (!canWrite) {
      throw new ForbiddenError("You do not have write permission for this trip");
    }

    return trip;
  }

  async createTrip(userId: string, data: CreateTripInput) {
    return this.prisma.trip.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async listUserTrips(userId: string) {
    return this.prisma.trip.findMany({
      where: {
        OR: [
          { userId },
          {
            collaborators: {
              some: {
                userId,
                acceptedAt: { not: null },
              },
            },
          },
        ],
      },
      orderBy: { startDate: "desc" },
    });
  }

  async getTripById(tripId: string, userId: string) {
    return this.checkAccess(tripId, userId, "read");
  }

  async updateTrip(tripId: string, userId: string, data: UpdateTripInput) {
    await this.checkAccess(tripId, userId, "write");

    return this.prisma.trip.update({
      where: { id: tripId },
      data,
    });
  }

  async deleteTrip(tripId: string, userId: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      throw new NotFoundError("Trip not found");
    }

    // Only the trip creator/owner can delete the entire trip
    if (trip.userId !== userId) {
      throw new ForbiddenError("Only the trip owner can delete this trip");
    }

    await this.prisma.trip.delete({
      where: { id: tripId },
    });
  }
}
