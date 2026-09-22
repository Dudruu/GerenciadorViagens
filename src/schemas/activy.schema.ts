import {z} from "zod"


export const activyResponseSchema = z.object({
    id : z.string().uuid(),
    destinationId : z.string(),
    title: z.string()
})