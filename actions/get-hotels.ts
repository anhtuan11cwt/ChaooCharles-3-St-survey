import { resolveLocationNames } from "@/lib/location-utils";
import { prisma } from "@/lib/prisma";

interface SearchParams {
  city?: string;
  state?: string;
  title?: string;
}

// Lấy danh sách khách sạn theo bộ lọc (title, state, city)
export const getHotels = async (searchParams: SearchParams = {}) => {
  try {
    const { title, state, city } = searchParams;

    const hotels = await prisma.hotel.findMany({
      include: { rooms: { include: { booking: true } } },
      where: {
        ...(title && { title: { contains: title } }),
        ...(state && { state }),
        ...(city && { city }),
      },
    });

    // Map mã tỉnh/huyện thành tên hiển thị
    const hotelsWithNames = await Promise.all(
      hotels.map(async (hotel) => {
        const { stateName, cityName } = await resolveLocationNames(
          hotel.state,
          hotel.city,
        );
        return { ...hotel, cityName, stateName };
      }),
    );

    return hotelsWithNames;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khách sạn:", error);
    throw new Error("Không thể lấy danh sách khách sạn");
  }
};
