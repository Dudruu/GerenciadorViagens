
import {z} from "zod"

export const createTripSchema = z.object({
    title :z.string().min(1),
    description: z.string(),
    startDate : z.coerce.date(),
    endDate: z.coerce.date(),
    coverImageUrl : z.string().url().optional()
})



export const updateTrip = createTripSchema.partial()

export const tripResponseSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().nullable(),
  startDate: z.date(),
  endDate: z.date(),
  coverImageUrl: z.string().url().nullable(),
  status: z.enum(["PLANNING", "ONGOING", "COMPLETED"]),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const tripParamsSchema = z.object({
  id: z.string(),
});