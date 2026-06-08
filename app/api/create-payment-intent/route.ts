import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  typescript: true,
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { booking } = body;

    const bookingData = {
      ...booking,
      currency: "vnd",
      paymentStatus: "false",
      userEmail: user.email,
      userId: user.id,
      username: user.name ?? user.email,
    };

    const room = await prisma.room.findUnique({
      include: { hotel: true },
      where: { id: bookingData.roomId },
    });

    if (!room) {
      return NextResponse.json(
        { error: "Không tìm thấy phòng" },
        { status: 404 },
      );
    }

    const session = await stripe.checkout.sessions.create({
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/hotel-details/${bookingData.hotelId}`,
      line_items: [
        {
          price_data: {
            currency: bookingData.currency,
            product_data: {
              description: `${room.hotel.title} - ${formatDate(bookingData.startDate)} đến ${formatDate(bookingData.endDate)}`,
              name: room.title,
            },
            unit_amount: bookingData.totalPrice,
          },
          quantity: 1,
        },
      ],
      metadata: {
        breakfastIncluded: String(bookingData.breakfastIncluded),
        endDate: bookingData.endDate,
        hotelId: bookingData.hotelId,
        hotelOwnerId: bookingData.hotelOwnerId,
        roomId: bookingData.roomId,
        startDate: bookingData.startDate,
        totalPrice: String(bookingData.totalPrice),
        userEmail: bookingData.userEmail,
        userId: bookingData.userId,
        username: bookingData.username,
      },
      mode: "payment",
      payment_method_types: ["card"],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/book-room/success?session_id={CHECKOUT_SESSION_ID}`,
    });

    await prisma.booking.create({
      data: {
        breakfastIncluded: bookingData.breakfastIncluded,
        currency: bookingData.currency,
        endDate: new Date(bookingData.endDate),
        hotelId: bookingData.hotelId,
        hotelOwnerId: bookingData.hotelOwnerId,
        paymentIntentId: (session.payment_intent as string) ?? session.id,
        paymentStatus: bookingData.paymentStatus,
        roomId: bookingData.roomId,
        startDate: new Date(bookingData.startDate),
        totalPrice: bookingData.totalPrice,
        userEmail: bookingData.userEmail,
        userId: bookingData.userId,
        userName: bookingData.username,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Lỗi tạo checkout session:", error);
    return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}
