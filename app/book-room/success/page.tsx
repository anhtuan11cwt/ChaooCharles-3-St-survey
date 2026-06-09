"use client";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

// Nội dung trang thành công — xác minh payment và tự động redirect
function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [verified, setVerified] = useState(false);

  // Xác minh thanh toán với server
  useEffect(() => {
    if (sessionId && !verified) {
      axios
        .post("/api/verify-payment", { sessionId })
        .then((res) => {
          if (res.data.success) {
            setVerified(true);
          }
        })
        .catch(() => {});
    }
  }, [sessionId, verified]);

  // Tự động chuyển về my-bookings sau 3 giây
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/my-bookings");
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <h1 className="text-2xl font-bold">Thanh toán thành công!</h1>
      <p className="text-muted-foreground">
        Cảm ơn bạn đã đặt phòng. Đơn hàng của bạn đã được xác nhận.
      </p>
      {sessionId && (
        <p className="text-sm text-muted-foreground">
          Mã đơn hàng: {sessionId}
        </p>
      )}
      <p className="text-sm text-muted-foreground">
        Tự động chuyển trang sau 3 giây...
      </p>
      <div className="flex gap-4 mt-4">
        <Button onClick={() => router.push("/my-bookings")} variant="outline">
          Xem đặt phòng
        </Button>
        <Button onClick={() => router.push("/")} variant="outline">
          Về trang chủ
        </Button>
      </div>
    </div>
  );
}

// Trang success — bọc Suspense vì dùng useSearchParams
export default function BookRoomSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <p>Đang tải...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
