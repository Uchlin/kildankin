import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  contextPromise: Promise<{ params: { id: string } }>
) {
  const { params } = await contextPromise;
  const id = params.id;

  const tournament = await prisma.tournament.findUnique({
    where: { id },
    include: {
      rounds: {
        include: {
          matches: {
            include: {
              white: true,
              black: true,
            },
          },
        },
        orderBy: { number: "asc" },
      },
    },
  });

  if (!tournament) {
    return new Response("Tournament not found", { status: 404 });
  }

  return Response.json(tournament);
}
