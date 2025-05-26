"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PrismaClient, Tournament } from "@prisma/client";
import { format } from "date-fns";
import { AddParticipantForm } from "./AddParticipantForm";

const prisma = new PrismaClient();

// Этот экспорт нужен на сервере (getServerSideProps или передача через пропсы)
async function fetchTournamentsWithParticipants() {
  return await prisma.tournament.findMany({
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
}

// Упростим тип для передачи в клиент
type TournamentWithParticipants = Awaited<ReturnType<typeof fetchTournamentsWithParticipants>>;

export default function ParticipantsPageClient({
  tournaments,
}: {
  tournaments: TournamentWithParticipants;
}) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Участники по турнирам</h1>

      {tournaments.length === 0 ? (
        <p className="text-gray-500">Нет турниров</p>
      ) : (
        tournaments.map((tournament) => (
          <div key={tournament.id} className="mb-6 border rounded-lg shadow p-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => handleToggle(tournament.id)}
            >
              <div>
                <h2 className="text-xl font-semibold">{tournament.name}</h2>
                <p className="text-sm text-gray-500">
                  Дата создания: {format(new Date(tournament.createdAt), "dd.MM.yyyy HH:mm")}
                </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Участников: {tournament.participants.length} / {tournament.participantsCount}
                  </p>
              </div>
              <button className="btn btn-sm btn-outline">
                {expanded === tournament.id ? "Скрыть" : "Показать участников"}
              </button>
            </div>

            {expanded === tournament.id && (
              <div className="mt-4">
                {tournament.participants.length === 0 ? (
                  <p className="text-gray-500">Нет участников</p>
                ) : (
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Фамилия</th>
                        <th>Имя</th>
                        <th>Рейтинг</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                        {tournament.participants.map((p) => (
                            <tr key={p.id}>
                            <td>{p.lastName}</td>
                            <td>{p.firstName}</td>
                            <td>{p.rating}</td>
                            <td>
                                <button
                                onClick={async () => {
                                    const confirmDelete = confirm(`Удалить ${p.lastName} ${p.firstName}?`);
                                    if (!confirmDelete) return;

                                    const res = await fetch("/api/participants/delete", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ participantId: p.id }),
                                    });

                                    if (res.ok) {
                                    router.refresh();
                                    } else {
                                    const err = await res.json();
                                    alert(err.error || "Ошибка при удалении");
                                    }
                                }}
                                className="btn btn-ghost p-2 h-0 flex text-xl"
                                >
                                ❌
                                </button>
                            </td>
                            </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
            <AddParticipantForm tournamentId={tournament.id} router={router} />
          </div>
        ))
      )}
    </div>
  );
}
