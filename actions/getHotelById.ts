import { resolveLocationNames } from "@/lib/location-utils";
import { prisma } from "@/lib/prisma";

export async function getHotelById(hotelId: string) {
  try {
    const hotel = await prisma.hotel.findUnique({
      include: { rooms: { include: { booking: true } } },
      where: { id: hotelId },
    });

    if (!hotel) return null;

    const { stateName, cityName } = await resolveLocationNames(
      hotel.state,
      hotel.city,
    );

    return { ...hotel, cityName, stateName };
  } catch (error) {
    console.error("Lỗi khi lấy khách sạn:", error);
    throw new Error("Không thể lấy khách sạn");
  }
}
