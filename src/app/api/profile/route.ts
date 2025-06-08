import { auth } from "~/server/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { email: true, firstName: true, lastName: true, role: true },
  });

  return NextResponse.json(user);
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const updated = await prisma.user.update({
    where: { email: session.user.email },
    data: {
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
    },
  });

  return NextResponse.json({ success: true, user: updated });
}
