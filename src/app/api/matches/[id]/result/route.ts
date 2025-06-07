import { PrismaClient, MatchResult } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
type Context = {
  params: {
    id: string;
  };
};
export async function POST(
  req: NextRequest,
  context: Context
) {
  const matchId = context.params.id;

  let { result } = await req.json();
  if (!result || !["WHITE_WIN", "BLACK_WIN", "DRAW", "NONE"].includes(result)) {
    result = "NONE";
  }
  const updated = await prisma.match.update({
    where: { id: matchId },
    data: { result: result as MatchResult },
  });

  return NextResponse.json(updated);
}
