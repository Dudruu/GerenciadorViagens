import {z} from "zod"
export const destinationResponseSchema = z.object({
  id: z.string().uuid(),
  tripId: z.string().uuid(),
  name: z.string(),
  country: z.string(),
  city: z.string(),
  arrivalDate: z.date(),
  departureDate: z.date(),
  order: z.number().int(),
});

export const createDestinationSchema =z.object({
    name : z.string(),
    country: z.string(),
    city: z.string(),
    arrivalDate: z.coerce.date(),
    departureDate: z.coerce.date(),
    order: z.number(),
} )
export const updateDestination = createDestinationSchema.partial()

export const destinationParams = z.object({
    tripId : z.string().uuid(),
    id: z.string().cuid().optional()
})