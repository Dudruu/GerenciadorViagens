import { z } from "zod";

export const tripStatusEnum = z.enum(["PLANNING", "ONGOING", "COMPLETED"]);

export const createTripSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required"),
    description: z.string().trim().optional().nullable(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    coverImageUrl: z.string().url("Invalid image URL").optional().nullable(),
    status: tripStatusEnum.default("PLANNING"),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be greater than or equal to start date",
    path: ["endDate"],
  });

export type CreateTripInput = z.infer<typeof createTripSchema>;

export const updateTripSchema = z
  .object({
    title: z.string().trim().min(1, "Title cannot be empty").optional(),
    description: z.string().trim().nullable().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    coverImageUrl: z.string().url("Invalid image URL").nullable().optional(),
    status: tripStatusEnum.optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.endDate >= data.startDate;
      }
      return true;
    },
    {
      message: "End date must be greater than or equal to start date",
      path: ["endDate"],
    }
  );

export type UpdateTripInput = z.infer<typeof updateTripSchema>;

export const tripResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  startDate: z.date(),
  endDate: z.date(),
  coverImageUrl: z.string().nullable(),
  status: tripStatusEnum,
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const tripParamsSchema = z.object({
  id: z.string().min(1, "Trip ID is required"),
});
