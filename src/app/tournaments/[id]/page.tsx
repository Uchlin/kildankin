"use client";

import { useState, useEffect } from "react";
import { Participant, Match, Round } from "@prisma/client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MatchResultEditor } from "~/app/_components/tournament/MatchResultEditor";
import { FinalStandings, getAllParticipants } from "~/app/_components/tournament/FinalStandings";

type MatchWithPlayers = Match & {
  white: Participant;
  black: Participant;
};

type RoundWithMatches = Round & {
  matches: MatchWithPlayers[];
};

type TournamentData = {
  id: string;
  name: string;
  roundsCount: number;
  rounds: RoundWithMatches[];
};

export default function TournamentDetailPage() {
  const params = useParams();
  const [data, setData] = useState<TournamentData | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRound, setSelectedRound] = useState<number>(1);

  useEffect(() => {
    fetch(`/api/tournament/${params.id}`)
      .then((res) => res.json())
      .then((d) => {
      console.log("Fetched tournament:", d); // 👈
      setData(d);})
  }, [params.id]);
  const handlePairing = async () => {
    setIsLoading(true);
    setMessage(null);

    const res = await fetch(`/api/tournament/${params.id}/pairings`, {
      method: "POST",
    });

    const data = await res.json();

    if (res.ok) {
      setMessage({ type: "success", text: data.message || "Жеребьёвка успешно проведена" });

      // Перезагрузить турнирные данные
      const updated = await fetch(`/api/tournament/${params.id}`).then((r) => r.json());
      setData(updated);
    } else {
      setMessage({ type: "error", text: data.error || "Произошла ошибка" });
    }

    setIsLoading(false);
  };
  if (!data) return <div className="p-6">Загрузка...</div>;
    if (data.rounds.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">{data.name}</h1>
        <p className="mb-4 text-white-600">В турнире ещё нет туров.</p>
        <button
          onClick={handlePairing}
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? "Провожу жеребьёвку..." : "Провести жеребьёвку первого тура"}
        </button>

        <div className="mt-4">
          {message && (
            <div
              className={`p-3 rounded flex items-center gap-2 ${
                message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {message.type === "success" ? "✅" : "⚠️"} {message.text}
            </div>
          )}
        </div>

        <Link href="/tournaments" className="btn btn-secondary mt-4">
          ← Назад
        </Link>
      </div>
    );
  }
  const round = selectedRound !== -1 ? data.rounds.find((r) => r.number === selectedRound) : null;

  if (selectedRound !== -1 && !round) {
    return <div>Тур {selectedRound} не найден</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{data.name}</h1>

      <div className="mb-4 flex gap-2 flex-wrap">
        {data.rounds.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedRound(r.number)}
            className={`btn ${r.number === selectedRound ? "btn-primary" : "btn-outline"}`}
          >
            Тур {r.number}
          </button>
        ))}
        {data.rounds.length === data.roundsCount &&
          data.rounds.every((r) => r.matches.every((m) => m.result !== "NONE")) && (
            <button
              onClick={() => setSelectedRound(-1)} // -1 будет обозначать "итоговую таблицу"
              className={`btn ${selectedRound === -1 ? "btn-primary" : "btn-outline"}`}
            >
              Результаты
            </button>
        )}
      </div>
      {selectedRound !== -1 && round && round.matches.every((m) => m.result !== "NONE") && selectedRound === data.rounds.length && selectedRound < data.roundsCount && (
        <button
          onClick={handlePairing}
          className="btn btn-primary "
          disabled={isLoading}
        >
          {isLoading ? "Провожу жеребьёвку..." : `Провести жеребьёвку тура ${selectedRound + 1}`}
        </button>
      )}
      {selectedRound === -1 ? (
  <FinalStandings rounds={data.rounds} participants={getAllParticipants(data.rounds)} />
    ) : (
      <table className="table w-full">
        <thead>
          <tr>
            <th className="p-2 border">Белые</th>
            <th className="p-2 border">Рейтинг</th>
            <th className="p-2 border">Очки до</th>
            <th className="p-2 border">Результат</th>
            <th className="p-2 border">Очки до</th>
            <th className="p-2 border">Черные</th>
            <th className="p-2 border">Рейтинг</th>
          </tr>
        </thead>
        <tbody>
          {selectedRound !== -1 && round && round.matches.map((match) => {
            const whiteScore = calculatePointsUntilRound(data.rounds, match.white.id, round.number);
            const blackScore = calculatePointsUntilRound(data.rounds, match.black.id, round.number);
            return (
              <tr key={match.id}>
                <td className="p-2 border">{match.white.lastName} {match.white.firstName}</td>
                <td className="p-2 border">{match.white.rating}</td>
                <td className="p-2 border">{whiteScore}</td>
                <td className="p-2 border">
                  <MatchResultEditor
                    matchId={match.id}
                    currentResult={match.result}
                    onResultUpdated={async () => {
                      // обновить турнирные данные после изменения результата
                      const updated = await fetch(`/api/tournament/${params.id}`).then(r => r.json());
                      setData(updated);
                    }}
                  />
                </td>

                <td className="p-2 border">{blackScore}</td>
                <td className="p-2 border">{match.black.lastName} {match.black.firstName}</td>
                <td className="p-2 border">{match.black.rating}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    )}
      

      <Link href="/tournaments" className="btn btn-secondary mt-4">← Назад</Link>
    </div>
  );
}

// Функция подсчёта очков игрока до указанного тура
function calculatePointsUntilRound(rounds: RoundWithMatches[], participantId: string, roundNumber: number): number {
  let points = 0;
  for (const round of rounds) {
    if (round.number >= roundNumber) break;

    for (const match of round.matches) {
      if (match.whiteId === participantId) {
        if (match.result === "WHITE_WIN") points += 1;
        else if (match.result === "DRAW") points += 0.5;
      } else if (match.blackId === participantId) {
        if (match.result === "BLACK_WIN") points += 1;
        else if (match.result === "DRAW") points += 0.5;
      }
    }
  }
  return points;
}