import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Cần nhập ID phòng" }, { status: 400 });
  }

  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const bookings = await prisma.booking.findMany({
      where: {
        endDate: { gt: yesterday },
        paymentStatus: "true",
        roomId: id,
      },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Lỗi lấy danh sách booking:", error);
    return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const booking = await prisma.booking.update({
      data: { paymentStatus: "true" },
      where: { paymentIntentId: id },
    });
    return NextResponse.json(booking);
  } catch (error) {
    console.error("Lỗi cập nhật booking:", error);
    return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const booking = await prisma.booking.delete({
      where: { id },
    });
    return NextResponse.json(booking);
  } catch (error) {
    console.error("Lỗi xóa booking:", error);
    return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}
