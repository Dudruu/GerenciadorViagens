import { PrismaClient } from "../generated/prisma/client";

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
