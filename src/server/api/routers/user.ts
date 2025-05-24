import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getByQuery: protectedProcedure
    .input(
      z.object({
        query: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findFirst({
        where: {
          OR: [
            { firstname: { contains: input.query } },
            { surname: { contains: input.query } },
          ],
        },
      });
    }),
  getStudentBySquad: protectedProcedure
    .input(
      z.object({
        squadId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const tu = await ctx.db.squad.findUnique({
        where: { id: input.squadId },
        include: {
          StudentsOnTasks: {
            include: { student: true }
          }
        },
      })
      return tu?.StudentsOnTasks.map((sot) => sot.student);
    }),

});