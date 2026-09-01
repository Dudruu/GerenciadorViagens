import type { FastifyInstance } from "fastify";

import z from "zod";

import { FastifyTypedInstance } from "../types";

export default function routes (app: FastifyTypedInstance){
    app.get("/places",{
        schema: {
            tags : ['places'], 
            description :"List places"
        },

        
    },()=>{
        return []
    })

    app.post ("/places",{
        schema:{
            tags: ['places'],
            description: 'create new place',
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