import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Room } from "@/lib/generated/prisma/client";

interface RoomDataType {
  breakfast: boolean;
  endDate: Date;
  room: Room;
  startDate: Date;
  totalPrice: number;
}

interface BookRoomStore {
  bookingRoomData: RoomDataType | null;
  clientSecret: string | undefined;
  paymentIntent: string | null;
  resetBookRoom: () => void;
  setClientSecret: (clientSecret: string) => void;
  setPaymentIntent: (paymentIntent: string) => void;
  setRoomData: (data: RoomDataType) => void;
}

const useBookRoom = create<BookRoomStore>()(
  persist(
    (set) => ({
      bookingRoomData: null,
      clientSecret: undefined,
      paymentIntent: null,
      resetBookRoom: () => {
        set({
          bookingRoomData: null,
          clientSecret: undefined,
          paymentIntent: null,
        });
      },
      setClientSecret: (clientSecret: string) => {
        set({ clientSecret });
      },
      setPaymentIntent: (paymentIntent: string) => {
        set({ paymentIntent });
      },
      setRoomData: (data: RoomDataType) => {
        set({ bookingRoomData: data });
      },
    }),
    { name: "bookRoom" },
  ),
);

export default useBookRoom;
