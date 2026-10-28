import { PrismaClient } from "../generated/prisma/client";
import { CreateDestinationInput, UpdateDestinationInput } from "../schemas/destination.schema";
import { NotFoundError } from "../errors/app-error";
import { TripService } from "./trip.service";

export class DestinationService {
  private tripService: TripService;

  constructor(private prisma: PrismaClient) {
    this.tripService = new TripService(prisma);
  }

  async createDestination(tripId: string, userId: string, data: CreateDestinationInput) {
    await this.tripService.checkAccess(tripId, userId, "write");

    return this.prisma.destination.create({
      data: {
        ...data,
        tripId,
      },
    });
  }

  async listDestinations(tripId: string, userId: string) {
    await this.tripService.checkAccess(tripId, userId, "read");

    return this.prisma.destination.findMany({
      where: { tripId },
      orderBy: { order: "asc" },
    });
  }

  async getDestinationById(tripId: string, destinationId: string, userId: string) {
    await this.tripService.checkAccess(tripId, userId, "read");

    const destination = await this.prisma.destination.findFirst({
      where: { id: destinationId, tripId },
    });

    if (!destination) {
      throw new NotFoundError("Destination not found");
    }

    return destination;
  }

  async updateDestination(
    tripId: string,
    destinationId: string,
    userId: string,
    data: UpdateDestinationInput
  ) {
    await this.tripService.checkAccess(tripId, userId, "write");

    const existing = await this.prisma.destination.findFirst({
      where: { id: destinationId, tripId },
    });

    if (!existing) {
      throw new NotFoundError("Destination not found");
    }

    return this.prisma.destination.update({
      where: { id: destinationId },
      data,
    });
  }

  async deleteDestination(tripId: string, destinationId: string, userId: string) {
    await this.tripService.checkAccess(tripId, userId, "write");

    const existing = await this.prisma.destination.findFirst({
      where: { id: destinationId, tripId },
    });

    if (!existing) {
      throw new NotFoundError("Destination not found");
    }

    await this.prisma.destination.delete({
      where: { id: destinationId },
    });
  }
}
