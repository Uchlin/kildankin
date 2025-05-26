
"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export async function addTournament(formData: FormData) {
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
