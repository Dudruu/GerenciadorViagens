import { PrismaClient } from "../generated/prisma/client";
import { TripService, AccessLevel } from "../services/trip.service";

export { AccessLevel };

export async function checkTripAccess(
  prisma: PrismaClient,
  tripId: string,
  userId: string,
  level: AccessLevel = "read"
) {
  try {
    const service = new TripService(prisma);
    const trip = await service.checkAccess(tripId, userId, level);
    return { trip, allowed: true };
  } catch {
    return { trip: null, allowed: false };
  }
}
