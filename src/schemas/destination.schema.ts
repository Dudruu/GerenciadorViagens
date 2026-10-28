import { z } from "zod";

export const createDestinationSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    country: z.string().trim().min(1, "Country is required"),
    city: z.string().trim().min(1, "City is required"),
    arrivalDate: z.coerce.date(),
    departureDate: z.coerce.date(),
    order: z.number().int().min(0).default(0),
  })
  .refine((data) => data.departureDate >= data.arrivalDate, {
    message: "Departure date must be greater than or equal to arrival date",
    path: ["departureDate"],
  });

export type CreateDestinationInput = z.infer<typeof createDestinationSchema>;

export const updateDestinationSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    country: z.string().trim().min(1).optional(),
    city: z.string().trim().min(1).optional(),
    arrivalDate: z.coerce.date().optional(),
    departureDate: z.coerce.date().optional(),
    order: z.number().int().min(0).optional(),
  })
  .refine(
    (data) => {
      if (data.arrivalDate && data.departureDate) {
        return data.departureDate >= data.arrivalDate;
      }
      return true;
    },
    {
      message: "Departure date must be greater than or equal to arrival date",
      path: ["departureDate"],
    }
  );

export type UpdateDestinationInput = z.infer<typeof updateDestinationSchema>;

export const destinationResponseSchema = z.object({
  id: z.string(),
  tripId: z.string(),
  name: z.string(),
  country: z.string(),
  city: z.string(),
  arrivalDate: z.date(),
  departureDate: z.date(),
  order: z.number().int(),
});

export const destinationTripParamsSchema = z.object({
  tripId: z.string().min(1, "Trip ID is required"),
});

export const destinationDetailParamsSchema = z.object({
  tripId: z.string().min(1, "Trip ID is required"),
  id: z.string().min(1, "Destination ID is required"),
});

// Backward compatibility aliases
export const destinationParams = destinationDetailParamsSchema;
export const updateDestination = updateDestinationSchema;
