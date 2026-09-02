import type { FastifyInstance } from "fastify";
import { authRoutes } from "./auth.routes";
import z from "zod";

import { FastifyTypedInstance } from "../types/types";

export default function routes (app: FastifyTypedInstance){
    app.get("/useres",{
        schema: {
            tags : ['users'], 
            description :"List users"
        },

        
    },()=>{
        return []
    })
    

    app.register(authRoutes, { prefix: "/auth" });

    app.post ("/users",{
        schema:{
            tags: ['users'],
            description: 'create new user',
            body : z.object({
                name: z.string(),
                locate : z.string(), 
            }),
        }
    }, (request)=>{
        const {name,locate} = request.body
        return {}
    })
}