import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import {z} from "zod";
import {
    destinationParams,
    destinationResponseSchema,
    createDestinationSchema,
    updateDestination,
} from "../schemas/destination.schema"
import { errorResponseSchema } from "../schemas/commun.schema";
import { checkTripAccess } from "../utils/trip-acess";



export const destinationRoutes: FastifyPluginAsyncZod = async (app)=>{

    app.post(
        "/:tripId/destination",
        {
            preHandler:[app.authenticate],
            schema:{
                security:[{ bearerAuth: [] }],
                params: destinationParams,
                body: createDestinationSchema,
                response : {201: destinationResponseSchema, 403:errorResponseSchema}
            }
        },
        async (request,reply) =>{
            const userId = request.user.userId
            const {tripId} = request.params;

            const{allowed} = await checkTripAccess(app.prisma,tripId,userId,"write")

            if (!allowed){
                return reply.status(403).send({message:"Dont have permission"});
            }
            const destination = await app.prisma.destination.create({
                data: {
                    ...request.body,
                    tripId,
                }
            })
            return reply.status(201).send(destination)
        }
    )


}