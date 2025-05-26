"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { TournamentActions } from "../_components/tournament/TournamentActions";

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
  }); // 🔄 Переместили сюда
  async function deleteTournament(formData: FormData) {
    "use server";
    const id = formData.get("id")?.toString();
    if (!id) return;
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

  async function addTournament(formData: FormData) {
    "use server";

    const name = formData.get("name")?.toString();
    const roundsCount = parseInt(formData.get("roundsCount")?.toString() || "0");
    const ownerId = formData.get("ownerId")?.toString();
    const participantsCount = parseInt(formData.get("participantsCount")?.toString() || "0");
    
    if (!name || isNaN(roundsCount) || !ownerId || isNaN(participantsCount)) {
      throw new Error("Неверные данные для турнира");
    }

    await prisma.tournament.create({
      data: {
        name,
        roundsCount,
        participantsCount,
        ownerId,
      },
    });

    revalidatePath("/tournaments");
    redirect("/tournaments");
  }



  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Список турниров</h1>

      <form action={addTournament} className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          name="name"
          placeholder="Название турнира"
          className="input input-bordered"
          required
        />
        <input
          name="roundsCount"
          type="number"
          placeholder="Количество раундов"
          className="input input-bordered"
          required
        />
        <input
          name="participantsCount"
          type="number"
          placeholder="Количество участников"
          className="input input-bordered"
          required
        />
        <select name="ownerId" className="select select-bordered" required>
          <option value="">Выберите организатора</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.lastName} {u.firstName}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary w-full">
          Создать
        </button>
      </form>

      <table className="table w-full">
        <thead>
          <tr>
            <th>Название</th>
            <th>Организатор</th>
            <th>Раунды</th>
            <th>Участников</th>
            <th>Создан</th>
          </tr>
        </thead>
        <tbody>
          {tournaments.map((t) => (
            <tr key={t.id}>
              <td>{t.name}</td>
              <td>{t.owner?.lastName} {t.owner?.firstName}</td>
              <td>{t.roundsCount}</td>
              <td>{t.participants.length} / {t.participantsCount}</td>
              <td>{new Date(t.createdAt).toLocaleDateString()}</td>
              <td>
                <TournamentActions
                  tournament={t}
                  users={users}
                  deleteTournament={deleteTournament}
                  editTournament={editTournament}
                />
            </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
