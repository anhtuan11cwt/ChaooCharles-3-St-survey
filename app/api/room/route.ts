import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Tạo phòng mới cho khách sạn
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Không được phép" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { hotelId, ...roomData } = body;
    if (!hotelId) {
      return NextResponse.json(
        { error: "Cần nhập ID khách sạn" },
        { status: 400 },
      );
    }

    const room = await prisma.room.create({
      data: { ...roomData, hotelId },
    });
    return NextResponse.json(room);
  } catch {
    return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}
