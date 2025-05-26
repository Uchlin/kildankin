import { PrismaClient } from "@prisma/client";
import ParticipantsPageClient from "../_components/participants/ParticipantsPage";

const prisma = new PrismaClient();

export default async function ParticipantsPage() {
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
