import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, firstName, lastName, rating } = body;

    if (!id || !firstName || !lastName || typeof rating !== "number") {
      return NextResponse.json({ error: "Неверные данные" }, { status: 400 });
    }

    await prisma.participant.update({
      where: { id },
      data: { firstName, lastName, rating },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[API ERROR]", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
