import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";
import { getCurrentUser } from "@/lib/auth";

const utapi = new UTApi();

export async function POST(request: Request) {
	const user = await getCurrentUser();
	if (!user) {
		return NextResponse.json({ error: "Không được phép" }, { status: 401 });
	}

	try {
		const { imageKey } = await request.json();
		const result = await utapi.deleteFiles(imageKey);
		return NextResponse.json({ result, success: true });
	} catch (error) {
		console.error("Lỗi khi xóa uploadthing:", error);
		return NextResponse.json(
			{ error: "Không thể xóa tập tin" },
			{ status: 500 },
		);
	}
}
