import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> },
) {
  const { roomId } = await params;
  if (!roomId) {
    return NextResponse.json({ error: "Cần nhập ID phòng" }, { status: 400 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Không được phép" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const room = await prisma.room.update({
      data: body,
      where: { id: roomId },
    });
    return NextResponse.json(room);
  } catch {
    return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ roomId: string }> },
) {
  const { roomId } = await params;
  if (!roomId) {
    return NextResponse.json({ error: "Cần nhập ID phòng" }, { status: 400 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Không được phép" }, { status: 401 });
  }

  try {
    const room = await prisma.room.delete({
      where: { id: roomId },
    });
    return NextResponse.json(room);
  } catch {
    return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}
