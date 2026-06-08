import { NextResponse } from "next/server";
import { verifyPayment } from "@/actions/verify-payment";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json({ error: "Thiếu session ID" }, { status: 400 });
    }

    const success = await verifyPayment(sessionId);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("Lỗi xác minh thanh toán:", error);
    return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}
