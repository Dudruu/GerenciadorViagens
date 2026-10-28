import { FastifyReply, FastifyRequest } from "fastify";
import { ActivityService } from "../services/activity.service";
import { CreateActivityInput, UpdateActivityInput } from "../schemas/activity.schema";

export class ActivityController {
  static async create(
    request: FastifyRequest<{
      Params: { tripId: string; destinationId: string };
      Body: CreateActivityInput;
    }>,
    reply: FastifyReply
  ) {
    const activityService = new ActivityService(request.server.prisma);
    const activity = await activityService.createActivity(
      request.params.tripId,
      request.params.destinationId,
      request.user.userId,
      request.body
    );
    return reply.status(201).send(activity);
  }

  static async list(
    request: FastifyRequest<{
      Params: { tripId: string; destinationId: string };
    }>,
    reply: FastifyReply
  ) {
    const activityService = new ActivityService(request.server.prisma);
    const activities = await activityService.listActivities(
      request.params.tripId,
      request.params.destinationId,
      request.user.userId
    );
    return reply.status(200).send(activities);
  }

  static async getById(
    request: FastifyRequest<{
      Params: { tripId: string; destinationId: string; id: string };
    }>,
    reply: FastifyReply
  ) {
    const activityService = new ActivityService(request.server.prisma);
    const activity = await activityService.getActivityById(
      request.params.tripId,
      request.params.destinationId,
      request.params.id,
      request.user.userId
    );
    return reply.status(200).send(activity);
  }

  static async update(
    request: FastifyRequest<{
      Params: { tripId: string; destinationId: string; id: string };
      Body: UpdateActivityInput;
    }>,
    reply: FastifyReply
  ) {
    const activityService = new ActivityService(request.server.prisma);
    const updated = await activityService.updateActivity(
      request.params.tripId,
      request.params.destinationId,
      request.params.id,
      request.user.userId,
      request.body
    );
    return reply.status(200).send(updated);
  }

  static async delete(
    request: FastifyRequest<{
      Params: { tripId: string; destinationId: string; id: string };
    }>,
    reply: FastifyReply
  ) {
    const activityService = new ActivityService(request.server.prisma);
    await activityService.deleteActivity(
      request.params.tripId,
      request.params.destinationId,
      request.params.id,
      request.user.userId
    );
    return reply.status(204).send();
  }
}
