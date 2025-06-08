import { PrismaClient } from "@prisma/client";
import ParticipantsPageClient from "../_components/participants/ParticipantsPage";
import { auth } from "~/server/auth";

const prisma = new PrismaClient();

export default async function ParticipantsPage() {
  const session = await auth();
  const tournaments = await prisma.tournament.findMany({
    include: {
      participants: {
        include: { user: true },
        orderBy: { lastName: "asc" },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  

  return <ParticipantsPageClient tournaments={tournaments} />;
}
