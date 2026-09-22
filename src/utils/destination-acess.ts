// src/utils/destination-access.ts
import { PrismaClient } from"../";

export async function checkDestinationBelongsToTrip(
  prisma: PrismaClient,
  tripId: string,
  destinationId: string
) {
  const destination = await prisma.destination.findFirst({
    where: { id: destinationId, tripId },
  });

  return destination;
}