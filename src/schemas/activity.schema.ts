import { z } from "zod";

export const createActivitySchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().nullable().optional(),
  date: z.coerce.date(),
  startTime: z.coerce.date().nullable().optional(),
  endTime: z.coerce.date().nullable().optional(),
  category: z.string().trim().min(1, "Category is required"),
  location: z.string().trim().nullable().optional(),
  cost: z.number().min(0, "Cost must be positive or zero").nullable().optional(),
});

export type CreateActivityInput = z.infer<typeof createActivitySchema>;

export const updateActivitySchema = createActivitySchema.partial();
export type UpdateActivityInput = z.infer<typeof updateActivitySchema>;

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

export const activityListParamsSchema = z.object({
  tripId: z.string().min(1, "Trip ID is required"),
  destinationId: z.string().min(1, "Destination ID is required"),
});

export const activityDetailParamsSchema = z.object({
  tripId: z.string().min(1, "Trip ID is required"),
  destinationId: z.string().min(1, "Destination ID is required"),
  id: z.string().min(1, "Activity ID is required"),
});

// Backward compatibility aliases
export const activityParams = activityDetailParamsSchema;
