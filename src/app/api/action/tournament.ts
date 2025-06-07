"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

// 📌 Функция оценки количества раундов по швейцарской системе
function estimateSwissRounds(N: number): number {
  if (N == 2) return 1 
  if (N <= 3) return 2;
  if (N <= 4) return 3;
  if (N <= 6) return 4; 
  if (N <= 8) return 5;
  if (N <= 16) return 6;
  if (N <= 32) return 7;
  if (N <= 64) return 8;
  if (N <= 128) return 9;
  if (N <= 256) return 10;
  if (N <= 512) return 11;
  if (N <= 1024) return 12;
  if (N <= 2048) return 13;
  if (N <= 4096) return 14;
  if (N <= 8192) return 15;
  return 16; // запас
}

export async function addTournament(formData: FormData) {
  const name = formData.get("name")?.toString();
  const ownerId = formData.get("ownerId")?.toString();
  const participantsCount = parseInt(formData.get("participantsCount")?.toString() || "0");

  if (!name || !ownerId || isNaN(participantsCount) || participantsCount < 2) {
    throw new Error("Неверные данные для турнира");
  }

  // ✅ Используем реалистичную оценку количества туров
  const roundsCount = estimateSwissRounds(participantsCount);

  await prisma.tournament.create({
    data: {
      name,
      participantsCount,
      roundsCount,
      ownerId,
    },
  });

  revalidatePath("/tournaments");
  redirect("/tournaments");
}
