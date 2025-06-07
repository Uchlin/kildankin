import { PrismaClient } from "@prisma/client";
import Link from "next/link";
const prisma = new PrismaClient();

export default async function PairingsPage() {
  const tournaments = await prisma.tournament.findMany({
    include: {
      rounds: {
        include: {
          matches: {
            include: {
              white: { include: { user: true } },
              black: { include: { user: true } },
            },
          },
        },
        orderBy: { number: "asc" },
      },
      participants: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Жеребьёвка и результаты</h1>

      {tournaments.map((tournament) => {
        const latestRound = tournament.rounds[tournament.rounds.length - 1];
        const nextRoundNumber = tournament.rounds.length + 1;

        return (
          <div key={tournament.id} className="mb-8 p-4 border shadow rounded-lg">
            <h2 className="text-xl font-semibold mb-2">{tournament.name}</h2>
            <p className="text-sm text-gray-500">
              Участников: {tournament.participants.length} / {tournament.participantsCount}
            </p>
            <p className="text-sm text-gray-500">
              Туров: {tournament.rounds.length} / {tournament.roundsCount}
            </p>

            {/* Кнопка жеребьевки нового тура */}
            {tournament.rounds.length < tournament.roundsCount && (
              <form action={`/api/tournament/${tournament.id}/pair`} method="POST" className="mt-4">
                <button className="btn btn-primary">Провести жеребьёвку тура {nextRoundNumber}</button>
              </form>
            )}

            {/* Пары последнего тура */}
            {latestRound && (
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-2">
                  Тур {latestRound.number} — пары:
                </h3>
                <table className="table w-full text-sm">
                  <thead>
                    <tr>
                      <th>Белые</th>
                      <th>Чёрные</th>
                      <th>Результат</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latestRound.matches.map((match) => (
                      <tr key={match.id}>
                        <td>{match.white.lastName} {match.white.firstName}</td>
                        <td>{match.black.lastName} {match.black.firstName}</td>
                        <td>
                            {match.result === "NONE" ? (
                                <form
                                action={`/api/matches/${match.id}/result`}
                                method="POST"
                                className="flex gap-1"
                                >
                                <input type="hidden" name="result" value="WHITE_WIN" />
                                <button title="1–0" className="px-2 py-1 bg-green-200 rounded">✅</button>

                                <input type="hidden" name="result" value="DRAW" />
                                <button title="½–½" className="px-2 py-1 bg-yellow-200 rounded">⚖️</button>

                                <input type="hidden" name="result" value="BLACK_WIN" />
                                <button title="0–1" className="px-2 py-1 bg-red-200 rounded">❌</button>
                                </form>
                            ) : (
                                {
                                WHITE_WIN: "1–0",
                                BLACK_WIN: "0–1",
                                DRAW: "½–½",
                                }[match.result]
                            )}
                            </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Ссылка на таблицу */}
            <div className="mt-4">
              <Link href={`/tournament/${tournament.id}/standings`} className="text-blue-600 underline">
                Посмотреть таблицу результатов
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
