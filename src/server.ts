import "dotenv/config"

import {fastify} from "fastify";
import {fastifyCors} from "@fastify/cors"
import { validatorCompiler, serializerCompiler } from "fastify-type-provider-zod";
import {fastifySwagger} from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import routes from "./routes/routes";
import  fastifyJwt from "@fastify/jwt";

import { ZodTypeProvider } from "fastify-type-provider-zod";
import prismaPlugin from "./plugins/prisma";

const app =  fastify().withTypeProvider<ZodTypeProvider>();

app.register(prismaPlugin);
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)
app.register(fastifyCors ,  {origin: '*'})
app.register(fastifyJwt,{
    secret: process.env.JWT as string
})
app.register(fastifySwagger,{
    openapi :{
        info:{
            title: 'Typed API',
            version : '1.0',
        }
    }
})

app.get("/health", async () => {
  const result = await app.prisma.$queryRaw`SELECT 1 as ok`;
  return { status: "ok", db: result };
});

app.register(routes)

app.register(fastifySwaggerUi,{
    routePrefix: '/docs',
})



app.listen({port : 3000}).then(()=>{
    console.log("server rodando");
})
 