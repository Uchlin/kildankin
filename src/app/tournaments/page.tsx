"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { TournamentActions } from "../_components/tournament/TournamentActions";
import { AddTournamentClient } from "../_components/tournament/AddTournamentClient";

const prisma = new PrismaClient();

export default async function TournamentsPage() {
  const tournaments = await prisma.tournament.findMany({
    include: {
      owner: true,
      participants: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const users = await prisma.user.findMany({
    orderBy: { lastName: "asc" },
  });
  async function deleteTournament(formData: FormData) {
    "use server";
    const id = formData.get("id")?.toString();
    if (!id) return;
    await prisma.match.deleteMany({
      where: {
        round: {
          tournamentId: id,
        },
      },
    });

    await prisma.round.deleteMany({
      where: {
        tournamentId: id,
      },
    });
    await prisma.participant.deleteMany({where: { tournamentId: id }});
    await prisma.tournament.delete({ where: { id } });

    revalidatePath("/tournaments");
  }
  async function editTournament(formData: FormData) {
    "use server";

    const id = formData.get("id")?.toString();
    const name = formData.get("name")?.toString();
    const roundsCount = parseInt(formData.get("roundsCount")?.toString() || "0");
    const participantsCount = parseInt(formData.get("participantsCount")?.toString() || "0");

    if (!id || !name || isNaN(roundsCount) || isNaN(participantsCount)) {
      throw new Error("Неверные данные для обновления");
    }

    await prisma.tournament.update({
      where: { id },
      data: {
        name,
        roundsCount,
        participantsCount,
      },
    });

    revalidatePath("/tournaments");
  }



  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Список турниров</h1>
      <AddTournamentClient users={users} />
      <table className="table w-full border">
        <thead>
          <tr className=" text-white-600">
            <th className="p-2 border">Название</th>
            <th className="p-2 border">Организатор</th>
            <th className="p-2 border">Раунды</th>
            <th className="p-2 border">Участников</th>
            <th className="p-2 border">Создан</th>
            <th className="p-2 border">Действия</th>
          </tr>
        </thead>
        <tbody>
          {tournaments.map((t) => (
            <TournamentActions
              key={t.id}
              tournament={t}
              users={users}
              deleteTournament={deleteTournament}
              editTournament={editTournament}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
