import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
	request: Request,
	{ params }: { params: Promise<{ hotelId: string }> },
) {
	const { hotelId } = await params;
	if (!hotelId) {
		return NextResponse.json(
			{ error: "Cần nhập ID khách sạn" },
			{ status: 400 },
		);
	}

	const user = await getCurrentUser();
	if (!user) {
		return NextResponse.json({ error: "Không được phép" }, { status: 401 });
	}

	try {
		const body = await request.json();
		const hotel = await prisma.hotel.update({
			data: body,
			where: { id: hotelId },
		});
		return NextResponse.json(hotel);
	} catch {
		return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
	}
}

export async function DELETE(
	_request: Request,
	{ params }: { params: Promise<{ hotelId: string }> },
) {
	const { hotelId } = await params;
	if (!hotelId) {
		return NextResponse.json(
			{ error: "Cần nhập ID khách sạn" },
			{ status: 400 },
		);
	}

	const user = await getCurrentUser();
	if (!user) {
		return NextResponse.json({ error: "Không được phép" }, { status: 401 });
	}

	try {
		const hotel = await prisma.hotel.delete({
			where: { id: hotelId },
		});
		return NextResponse.json(hotel);
	} catch {
		return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
	}
}
