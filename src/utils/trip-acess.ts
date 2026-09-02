
import { PrismaClient } from "../generated/prisma/client";

type AccessLevel = "read" | "write";

export async function checkTripAccess(
  prisma: PrismaClient,
  tripId: string,
  userId: string,
  level: AccessLevel = "read"
) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      collaborators: {
        where: { userId },
      },
    },
  });

  if (!trip) return { trip: null, allowed: false };

  const isOwner = trip.userId === userId;
  const collaborator = trip.collaborators[0];

  if (isOwner) {
    return { trip, allowed: true };
  }

  if (!collaborator || !collaborator.acceptedAt) {
    return { trip, allowed: false };
  }

  if (level === "read") {
    return { trip, allowed: true };
  }

  const canWrite = collaborator.role === "EDITOR";
  return { trip, allowed: canWrite };
}