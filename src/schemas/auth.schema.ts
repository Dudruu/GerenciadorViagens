// src/schemas/activity.schema.ts
import { z } from "zod";

export const createActivitySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  date: z.coerce.date(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
  category: z.string().min(1),
  location: z.string().optional(),
  cost: z.number().optional(),
});

export const updateActivitySchema = createActivitySchema.partial();

export const activityResponseSchema = z.object({
  id: z.string(),
  destinationId: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  date: z.date(),
  startTime: z.date().nullable(),
  endTime: z.date().nullable(),
  category: z.string(),
  location: z.string().nullable(),
  cost: z.number().nullable(),
});

export const activityParams = z.object({
  tripId: z.string(),
  destinationId: z.string(),
  id: z.string().optional(),
});