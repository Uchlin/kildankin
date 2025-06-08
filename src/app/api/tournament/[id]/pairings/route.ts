import { NextResponse } from "next/server";
import { PrismaClient, Participant, MatchResult, Round, Match } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const tournamentId = params.id;

  // Получаем турнир с участниками и предыдущими турами
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    include: {
      participants: true,
      rounds: {
        include: {
          matches: true,
        },
      },
    },
  });

  if (!tournament) {
    return NextResponse.json({ error: "Турнир не найден" }, { status: 404 });
  }

  if (tournament.participants.length < tournament.participantsCount) {
    return NextResponse.json({
      error: `Недостаточно участников (${tournament.participants.length}/${tournament.participantsCount})`,
    }, { status: 400 });
  }

  const previousRounds = tournament.rounds;
  const isFirstRound = previousRounds.length === 0;
  const nextRoundNumber = previousRounds.length + 1;

  let matches: {
    id: string;
    whiteId: string;
    blackId: string;
    result: MatchResult;
  }[] = [];

  if (isFirstRound) {
    const shuffled = [...tournament.participants].sort(() => Math.random() - 0.5);

    for (let i = 0; i < shuffled.length; i += 2) {
        const white = shuffled[i];
        const black = shuffled[i + 1];

        if (white && black) {
            matches.push({
                id: randomUUID(),
                whiteId: white.id,
                blackId: black.id,
                result: "NONE",
            });
        } else if (white && !hasHadBye(white.id, previousRounds)) {
        // Нечётное число участников: white получает bye
        matches.push({
            id: randomUUID(),
            whiteId: white.id,
            blackId: white.id, // или можно использовать специальный null или dummy ID
            result: "WHITE_WIN",
        });
        }
    }
  } else {
    // Следующие раунды: швейцарская система

    // Шаг 1: Подсчёт очков участников
    const resultsByParticipant: Record<string, number> = {};

    for (const participant of tournament.participants) {
      let score = 0;
      for (const round of previousRounds) {
        for (const match of round.matches) {
          if (match.whiteId === participant.id) {
            if (match.result === "WHITE_WIN") score += 1;
            if (match.result === "DRAW") score += 0.5;
          } else if (match.blackId === participant.id) {
            if (match.result === "BLACK_WIN") score += 1;
            if (match.result === "DRAW") score += 0.5;
          }
        }
      }
      resultsByParticipant[participant.id] = score;
    }

    // Шаг 2: Группировка по очкам
    const scoreGroups: Record<string, Participant[]> = {};
    for (const participant of tournament.participants) {
      const score = resultsByParticipant[participant.id] ?? 0;
      const key = score.toFixed(1); // ключ как строка (например, "1.5")
      if (!scoreGroups[key]) scoreGroups[key] = [];
      scoreGroups[key].push(participant);
    }

    // Шаг 3: Сортировка групп по убыванию очков
    const sortedScores = Object.keys(scoreGroups)
      .map((s) => parseFloat(s))
      .filter((n) => !isNaN(n))
      .sort((a, b) => b - a);

    const used = new Set<string>();
    let carryOver: Participant | null = null;

    for (const score of sortedScores) {
      const group = [...(scoreGroups[score.toFixed(1)] ?? [])];

      // Добавить участника из предыдущей группы, если он остался без пары
      if (carryOver) {
        group.push(carryOver);
        carryOver = null;
      }

      // Сортировка по рейтингу для стабильности
      group.sort((a, b) => b.rating - a.rating);

      for (let i = 0; i < group.length; i += 2) {
        const white = group[i];
        const black = group[i + 1];

        if (!white || !black) {
          carryOver = (white || black) ?? null;
          continue;
        }

        if (used.has(white.id) || used.has(black.id)) continue;

        used.add(white.id);
        used.add(black.id);

        matches.push({
          id: randomUUID(),
          whiteId: white.id,
          blackId: black.id,
          result: "NONE",
        });
      }
    }

    // Если один игрок остался непарным — получает bye (опционально)
    if (carryOver && !used.has(carryOver.id)&& !hasHadBye(carryOver.id, previousRounds)) {
      // Добавляем фиктивный матч с автоматической победой (например, белыми)
      matches.push({
        id: randomUUID(),
        whiteId: carryOver.id,
        blackId: carryOver.id, // может быть null, если разрешено
        result: "WHITE_WIN", // или специальный тип "BYE"
      });
    }
  }

  // Создание раунда и матчей
  const round = await prisma.round.create({
    data: {
      number: nextRoundNumber,
      tournamentId,
      matches: {
        createMany: {
          data: matches,
        },
      },
    },
  });

  return NextResponse.json({ message: "Жеребьёвка завершена", round });
}
function hasHadBye(participantId: string, rounds: (Round & { matches: Match[] })[]): boolean {
  return rounds.some((round) =>
    round.matches.some(
      (match) =>
        match.result === "WHITE_WIN" &&
        match.whiteId === participantId &&
        match.blackId === participantId // bye-признак
    )
  );
}