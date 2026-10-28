import { FastifyInstance } from "fastify";
import { authRoutes } from "./auth.routes";
import { tripRoutes } from "./trip.routes";
import { destinationRoutes } from "./destination.routes";
import { activityRoutes } from "./activity.routes";

export async function appRoutes(app: FastifyInstance) {
  // Auth routes: /auth/register, /auth/login, /auth/me
  await app.register(authRoutes, { prefix: "/auth" });

  // Trip routes: /trips and backwards-compatible /trip
  await app.register(tripRoutes, { prefix: "/trips" });
  await app.register(tripRoutes, { prefix: "/trip" });

  // Destination routes: /trips/:tripId/destinations and /trip/:tripId/destination
  await app.register(destinationRoutes, { prefix: "/trips" });
  await app.register(destinationRoutes, { prefix: "/trip" });

  // Activity routes: /trips/:tripId/destinations/:destinationId/activities
  await app.register(activityRoutes, { prefix: "/trips" });
  await app.register(activityRoutes, { prefix: "/trip" });
}

export default appRoutes;
