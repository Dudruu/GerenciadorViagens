import { z } from "zod";

export const errorResponseSchema = z.object({
  statusCode: z.number().optional(),
  error: z.string().optional(),
  message: z.string(),
  issues: z
    .array(
      z.object({
        path: z.string(),
        message: z.string(),
      })
    )
    .optional(),
});

export const idParamSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

export const messageResponseSchema = z.object({
  message: z.string(),
});
