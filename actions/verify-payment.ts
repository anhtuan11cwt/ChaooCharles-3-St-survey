import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  typescript: true,
});

export async function verifyPayment(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const metadata = session.metadata;
      if (!metadata) return false;

      const existingBooking = await prisma.booking.findFirst({
        where: {
          roomId: metadata.roomId,
          startDate: new Date(metadata.startDate),
          userId: metadata.userId,
        },
      });

      if (existingBooking && existingBooking.paymentStatus !== "true") {
        await prisma.booking.update({
          data: {
            paymentIntentId: (session.payment_intent as string) ?? session.id,
            paymentStatus: "true",
          },
          where: { id: existingBooking.id },
        });
      }

      return true;
    }

    return false;
  } catch (error) {
    console.error("Lỗi xác minh thanh toán:", error);
    return false;
  }
}
