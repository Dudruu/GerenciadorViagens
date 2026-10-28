import { PrismaClient } from "../generated/prisma/client";
import { CreateActivityInput, UpdateActivityInput } from "../schemas/activity.schema";
import { NotFoundError } from "../errors/app-error";
import { TripService } from "./trip.service";

export class ActivityService {
  private tripService: TripService;

  constructor(private prisma: PrismaClient) {
    this.tripService = new TripService(prisma);
  }

  private async verifyDestinationInTrip(tripId: string, destinationId: string) {
    const destination = await this.prisma.destination.findFirst({
      where: { id: destinationId, tripId },
    });

    if (!destination) {
      throw new NotFoundError("Destination not found in this trip");
    }

    return destination;
  }

  async createActivity(
    tripId: string,
    destinationId: string,
    userId: string,
    data: CreateActivityInput
  ) {
    await this.tripService.checkAccess(tripId, userId, "write");
    await this.verifyDestinationInTrip(tripId, destinationId);

    return this.prisma.activity.create({
      data: {
        ...data,
        destinationId,
      },
    });
  }

  async listActivities(tripId: string, destinationId: string, userId: string) {
    await this.tripService.checkAccess(tripId, userId, "read");
    await this.verifyDestinationInTrip(tripId, destinationId);

    return this.prisma.activity.findMany({
      where: { destinationId },
      orderBy: { date: "asc" },
    });
  }

  async getActivityById(
    tripId: string,
    destinationId: string,
    activityId: string,
    userId: string
  ) {
    await this.tripService.checkAccess(tripId, userId, "read");
    await this.verifyDestinationInTrip(tripId, destinationId);

    const activity = await this.prisma.activity.findFirst({
      where: { id: activityId, destinationId },
    });

    if (!activity) {
      throw new NotFoundError("Activity not found");
    }

    return activity;
  }

  async updateActivity(
    tripId: string,
    destinationId: string,
    activityId: string,
    userId: string,
    data: UpdateActivityInput
  ) {
    await this.tripService.checkAccess(tripId, userId, "write");
    await this.verifyDestinationInTrip(tripId, destinationId);

    const existing = await this.prisma.activity.findFirst({
      where: { id: activityId, destinationId },
    });

    if (!existing) {
      throw new NotFoundError("Activity not found");
    }

    return this.prisma.activity.update({
      where: { id: activityId },
      data,
    });
  }

  async deleteActivity(
    tripId: string,
    destinationId: string,
    activityId: string,
    userId: string
  ) {
    await this.tripService.checkAccess(tripId, userId, "write");
    await this.verifyDestinationInTrip(tripId, destinationId);

    const existing = await this.prisma.activity.findFirst({
      where: { id: activityId, destinationId },
    });

    if (!existing) {
      throw new NotFoundError("Activity not found");
    }

    await this.prisma.activity.delete({
      where: { id: activityId },
    });
  }
}
