import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import bcrypt from "bcryptjs";
import { errorResponseSchema } from "../schemas/commun.schema";

import {
  registerSchema,
  loginSchema,
  authResponseSchema,
} from "../schemas/auth.schema";
import { string } from "zod";
import { request } from "node:http";

export const authRoutes: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/register",
    {
      schema: {
        body: registerSchema,
        response: {
        201: authResponseSchema,
        409: errorResponseSchema,
      },
      },
    },

    async (request, reply) => {
      const { name, email, password } = request.body;

      const existingUser = await app.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return reply
          .status(409)
          .send({ message: "The email already exists. " });
      }

      const hashPassword = await bcrypt.hash(password,10)

      const user = await app.prisma.user.create({
            data:{
                name,
                email,
                password:hashPassword
            }
      })

      const token  =  app.jwt.sign({userId: user.id})

      return reply.status(201).send({
        token,
        user : {
            id: user.id,
            name: user.name,
            email: user.email
        }
      })


    },
  );


  app.post('/login',{
    schema:{
        body: loginSchema,
        response: {
        201: authResponseSchema,
        409: errorResponseSchema,
      },
    }
  },
    async (request,reply)=>{
        const {email,password} = request.body
        const user = await app.prisma.user.findUnique({where:{email}})

        if(!user){
            return reply.status(409).send({message:"This acount doesn't exist!"})
        }

        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches){
            return reply.status(409).send({message:"The password does not match"})
        }

        const token = app.jwt.sign({userId : user.id})

        return reply.send({
            token,
            user:{ id: user.id, name:user.name, email:user.email, }
        });
    }
  );




};
