import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export async function createAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/users",
    {
      schema: {
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(6, "Password must be at least 6 characters"),
        }),
        response: {
          201: z.object({
            id: z.string().uuid(),
            name: z.string(),
            email: z.string().email(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body;

      // Verifica se já existe usuário com o mesmo e-mail
      const userWithSameEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (userWithSameEmail) {
        return reply.status(400).send({
          message: "User with same e-mail already exists.",
        });
      }

      // Hash da senha
      const passwordHash = await hash(password, 10);

      // Cria usuário
      const user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      return reply.status(201).send(user);
    },
  );
}
