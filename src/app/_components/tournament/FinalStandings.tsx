import { Match, Participant, Round } from "@prisma/client";

type MatchWithPlayers = Match & {
  white: Participant;
  black: Participant;
};
type RoundWithMatches = Round & {
  matches: MatchWithPlayers[];
};
export function getAllParticipants(rounds: RoundWithMatches[]): Participant[] {
  const map = new Map<string, Participant>();
  for (const round of rounds) {
    for (const match of round.matches) {
      map.set(match.white.id, match.white);
      map.set(match.black.id, match.black);
    }
  }
  return Array.from(map.values());
}

function calculateTotalPoints(rounds: RoundWithMatches[], participantId: string): number {
  return calculatePointsUntilRound(rounds, participantId, Infinity);
}

function calculateBuchholz(rounds: RoundWithMatches[], participantId: string): number {
  let opponents: string[] = [];

  for (const round of rounds) {
    for (const match of round.matches) {
      if (match.whiteId === participantId) opponents.push(match.blackId);
      if (match.blackId === participantId) opponents.push(match.whiteId);
    }
  }

  return opponents.reduce((sum, opponentId) => sum + calculateTotalPoints(rounds, opponentId), 0);
}

export function FinalStandings({
  rounds,
  participants,
}: {
  rounds: RoundWithMatches[];
  participants: Participant[];
}) {
  const standings = participants.map((p) => ({
    participant: p,
    points: calculateTotalPoints(rounds, p.id),
    buchholz: calculateBuchholz(rounds, p.id),
  }));

  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.buchholz - a.buchholz;
  });

  return (
    <div className="overflow-x-auto mt-4">
      <h2 className="text-2xl font-semibold mb-2">Итоговая таблица</h2>
      <table className="table w-full">
        <thead>
          <tr>
            <th>Место</th>
            <th>Участник</th>
            <th>Рейтинг</th>
            <th>Очки</th>
            <th>Бухгольц</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s, i) => (
            <tr key={s.participant.id}>
              <td>{i + 1}</td>
              <td>
                {s.participant.lastName} {s.participant.firstName}
              </td>
              <td>{s.participant.rating}</td>
              <td>{s.points}</td>
              <td>{s.buchholz}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
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