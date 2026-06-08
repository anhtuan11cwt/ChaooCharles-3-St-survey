import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
	const user = await getCurrentUser();
	if (!user) {
		return NextResponse.json({ error: "Không được phép" }, { status: 401 });
	}

	try {
		const body = await request.json();
		const hotel = await prisma.hotel.create({
			data: { ...body, userId: user.id },
		});
		return NextResponse.json(hotel);
	} catch {
		return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
	}
}
