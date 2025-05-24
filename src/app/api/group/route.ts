import { NextRequest } from "next/server";
import { db } from "~/server/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;  
  const page = Number(searchParams.get("page")) || 1;
  const size = Number(searchParams.get("size")) || 3;
  const groups = await db.group.findMany({
    skip: (page - 1) * size,
    take: size,
  });
  return new Response(JSON.stringify(groups), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const name = formData.get("name");

  if (!name || typeof name !== "string") {
    return new Response(JSON.stringify({ error: "Некорректное имя" }), {
      status: 400,
    });
  }

  const group = await db.group.create({
    data: { name },
  });

  return new Response(JSON.stringify(group), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
