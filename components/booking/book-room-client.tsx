"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import RoomPaymentForm from "@/components/booking/room-payment-form";
import RoomCard from "@/components/room/room-card";
import useBookRoom from "@/hooks/useBookRoom";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
);

export default function BookRoomClient() {
  const router = useRouter();
  const { bookingRoomData, clientSecret, resetBookRoom } = useBookRoom();
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!clientSecret || !bookingRoomData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-muted-foreground text-lg">
          Oops! Trang này không thể tải đúng cách.
        </p>
        <button
          className="text-primary underline"
          onClick={() => router.push("/")}
          type="button"
        >
          Về trang chủ
        </button>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-lg font-semibold">Thanh toán thành công!</p>
        <button
          className="text-primary underline"
          onClick={() => router.push("/my-bookings")}
          type="button"
        >
          Xem đặt phòng
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[700px] mx-auto p-8">
      <RoomCard bookings={[]} room={bookingRoomData.room} />
      <Elements options={{ clientSecret }} stripe={stripePromise}>
        <RoomPaymentForm
          bookingRoomData={bookingRoomData}
          handleSetPaymentSuccess={setPaymentSuccess}
          resetBookRoom={resetBookRoom}
        />
      </Elements>
    </div>
  );
}
