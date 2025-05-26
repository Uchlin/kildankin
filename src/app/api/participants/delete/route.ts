import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { participantId } = body;

  if (!participantId) {
    return NextResponse.json({ error: "Не указан ID участника" }, { status: 400 });
  }

  try {
    await prisma.participant.delete({
      where: { id: participantId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ошибка удаления участника:", error);
    return NextResponse.json({ error: "Ошибка при удалении" }, { status: 500 });
  }
}
