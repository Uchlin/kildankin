import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, tournamentId, firstName, lastName, email, rating } = body;

  if (
    !userId &&
    (!firstName || !lastName || !email || rating === undefined || rating === null)
  ) {
    return NextResponse.json({ error: "Недостаточно данных" }, { status: 400 });
  }

  // Получаем турнир и текущих участников
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    include: { participants: true },
  });

  if (!tournament) {
    return NextResponse.json({ error: "Турнир не найден" }, { status: 404 });
  }

  // ❌ Если участников уже максимум
  if (tournament.participants.length >= tournament.participantsCount) {
    return NextResponse.json({ error: "Турнир уже заполнен" }, { status: 403 });
  }

  let user;

  if (userId) {
    user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }
  } else {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email уже используется" }, { status: 409 });
    }

    user = await prisma.user.create({
      data: { firstName, lastName, email },
    });
  }

  const alreadyParticipant = await prisma.participant.findFirst({
    where: { userId: user.id, tournamentId },
  });

  if (alreadyParticipant) {
    return NextResponse.json({ error: "Пользователь уже в турнире" }, { status: 409 });
  }

  const participant = await prisma.participant.create({
    data: {
      userId: user.id,
      tournamentId,
      firstName: user.firstName,
      lastName: user.lastName,
      rating: rating || Math.floor(Math.random() * 2500 + 1000),
    },
  });

  return NextResponse.json(participant);
}
