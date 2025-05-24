import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) {
    const id = (await params).id
    const { name } = await request.json();
    const group = await db.group.update({
        where: { id },
        data: {
            name,
        },
    });
    return new Response(JSON.stringify(group), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;  
  
    if (!id) {
        return new NextResponse(
            JSON.stringify({ error: "Нету  id" }),
            { status: 400 }
        );
    }
  
    try {
        await db.group.delete({
            where: { id },
        });
  
        return new NextResponse(
            JSON.stringify({ message: "Группа удалена" }),
            { status: 200 }
        );
    } catch (error) {
        return new NextResponse(
            JSON.stringify({ error: "Не удалось удалить группу" }),
            { status: 500 }
        );
    }
}
