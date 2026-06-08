import addIcon from "./addIcon.svg";
import arrowIcon from "./arrowIcon.svg";
import badgeIcon from "./badgeIcon.svg";
import calenderIcon from "./calenderIcon.svg";
import closeIcon from "./closeIcon.svg";
import closeMenu from "./closeMenu.svg";
import dashboardIcon from "./dashboardIcon.svg";
import exclusiveOfferCardImg1 from "./exclusiveOfferCardImg1.png";
import exclusiveOfferCardImg2 from "./exclusiveOfferCardImg2.png";
import exclusiveOfferCardImg3 from "./exclusiveOfferCardImg3.png";
import facebookIcon from "./facebookIcon.svg";
import freeBreakfastIcon from "./freeBreakfastIcon.svg";
import freeWifiIcon from "./freeWifiIcon.svg";
import guestsIcon from "./guestsIcon.svg";
import heartIcon from "./heartIcon.svg";
import homeIcon from "./homeIcon.svg";
import instagramIcon from "./instagramIcon.svg";
import linkendinIcon from "./linkendinIcon.svg";
import listIcon from "./listIcon.svg";
import locationFilledIcon from "./locationFilledIcon.svg";
import locationIcon from "./locationIcon.svg";
import logo from "./logo.svg";
import menuIcon from "./menuIcon.svg";
import mountainIcon from "./mountainIcon.svg";
import poolIcon from "./poolIcon.svg";
import regImage from "./regImage.png";
import roomImg1 from "./roomImg1.png";
import roomImg2 from "./roomImg2.png";
import roomImg3 from "./roomImg3.png";
import roomImg4 from "./roomImg4.png";
import roomServiceIcon from "./roomServiceIcon.svg";
import searchIcon from "./searchIcon.svg";
import starIconFilled from "./starIconFilled.svg";
import starIconOutlined from "./starIconOutlined.svg";
import totalBookingIcon from "./totalBookingIcon.svg";
import totalRevenueIcon from "./totalRevenueIcon.svg";
import twitterIcon from "./twitterIcon.svg";
import uploadArea from "./uploadArea.svg";
import userIcon from "./userIcon.svg";

export const assets = {
  addIcon,
  arrowIcon,
  badgeIcon,
  calenderIcon,
  closeIcon,
  closeMenu,
  dashboardIcon,
  facebookIcon,
  freeBreakfastIcon,
  freeWifiIcon,
  guestsIcon,
  heartIcon,
  homeIcon,
  instagramIcon,
  linkendinIcon,
  listIcon,
  locationFilledIcon,
  locationIcon,
  logo,
  menuIcon,
  mountainIcon,
  poolIcon,
  regImage,
  roomServiceIcon,
  searchIcon,
  starIconFilled,
  starIconOutlined,
  totalBookingIcon,
  totalRevenueIcon,
  twitterIcon,
  uploadArea,
  userIcon,
};

export const cities = ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Nha Trang"];

// Exclusive Offers Dummy Data
export const exclusiveOffers = [
  {
    _id: 1,
    description: "Tận hưởng một đêm miễn phí và bữa sáng hàng ngày",
    expiryDate: "31/08",
    image: exclusiveOfferCardImg1,
    priceOff: 25,
    title: "Gói Trốn Hè",
  },
  {
    _id: 2,
    description: "Gói dành cho cặp đôi đặc biệt bao gồm dịch vụ spa",
    expiryDate: "20/09",
    image: exclusiveOfferCardImg2,
    priceOff: 20,
    title: "Kỳ Nghỉ Lãng Mạn",
  },
  {
    _id: 3,
    description:
      "Đặt trước 60 ngày và tiết kiệm cho kỳ nghỉ của bạn tại bất kỳ khách sạn cao cấp nào trên toàn thế giới.",
    expiryDate: "25/09",
    image: exclusiveOfferCardImg3,
    priceOff: 30,
    title: "Nghỉ Dưỡng Cao Cấp",
  },
];

// Testimonials Dummy Data
export const testimonials = [
  {
    address: "Đà Lạt, Lâm Đồng",
    id: 1,
    image:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
    name: "Nguyễn Thị Mai",
    rating: 5,
    review:
      "Tôi đã sử dụng nhiều nền tảng đặt phòng trước đây, nhưng không có nền tảng nào có thể so sánh với trải nghiệm cá nhân hóa và sự chú ý đến từng chi tiết mà QuickStay mang lại.",
  },
  {
    address: "TP. Hồ Chí Minh",
    id: 2,
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    name: "Trần Văn Nam",
    rating: 4,
    review:
      "QuickStay đã vượt quá mong đợi của tôi. Quy trình đặt phòng rất mượt mà và các khách sạn đều đẳng cấp nhất. Rất đáng giới thiệu!",
  },
  {
    address: "Hội An, Quảng Nam",
    id: 3,
    image:
      "https://images.unsplash.com/photo-1701615004837-40d8573b6652?q=80&w=200",
    name: "Lê Thị Hương",
    rating: 5,
    review:
      "Dịch vụ tuyệt vời! Tôi luôn tìm được những chỗ nghỉ cao cấp nhất thông qua QuickStay. Các đề xuất của họ không bao giờ làm tôi thất vọng!",
  },
];

// Facility Icon
export const facilityIcons = {
  "Bữa Sáng Miễn Phí": assets.freeBreakfastIcon,
  "Dịch Vụ Phòng": assets.roomServiceIcon,
  "Hồ Bơi": assets.poolIcon,
  "View Núi": assets.mountainIcon,
  "WiFi Miễn Phí": assets.freeWifiIcon,
};

// For Room Details Page
export const roomCommonData = [
  {
    description: "Không gian sạch sẽ và vệ sinh dành riêng cho bạn.",
    icon: assets.homeIcon,
    title: "Lưu Trú Sạch Sẽ & An Toàn",
  },
  {
    description: "Chủ nhà tuân thủ tiêu chuẩn vệ sinh nghiêm ngặt của Staybnb.",
    icon: assets.badgeIcon,
    title: "Vệ Sinh Tăng Cường",
  },
  {
    description: "90% khách đánh giá vị trí 5 sao.",
    icon: assets.locationFilledIcon,
    title: "Vị Trí Tuyệt Vời",
  },
  {
    description: "100% khách đánh giá quy trình nhận phòng 5 sao.",
    icon: assets.heartIcon,
    title: "Nhận Phòng Dễ Dàng",
  },
];

// User Dummy Data
export const userDummyData = {
  __v: 1,
  _id: "user_2unqyL4diJFP1E3pIBnasc7w8hP",
  createdAt: "2025-03-25T09:29:16.367Z",
  email: "user.greatstack@gmail.com",
  image:
    "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJ2N2c5YVpSSEFVYVUxbmVYZ2JkSVVuWnFzWSJ9",
  recentSearchedCities: ["Hà Nội"],
  role: "hotelOwner",
  updatedAt: "2025-04-10T06:34:48.719Z",
  username: "Nguyễn Minh Tuấn",
};

// Hotel Dummy Data
export const hotelDummyData = {
  __v: 0,
  _id: "67f76393197ac559e4089b72",
  address: "Đường Chính 123, Khu 23",
  city: "Hà Nội",
  contact: "+0123456789",
  createdAt: "2025-04-10T06:22:11.663Z",
  name: "Khách Sạn Ánh Dương",
  owner: userDummyData,
  updatedAt: "2025-04-10T06:22:11.663Z",
};

// Rooms Dummy Data
export const roomsDummyData = [
  {
    __v: 0,
    _id: "67f7647c197ac559e4089b96",
    amenities: ["Dịch Vụ Phòng", "View Núi", "Hồ Bơi"],
    createdAt: "2025-04-10T06:26:04.013Z",
    hotel: hotelDummyData,
    images: [roomImg1, roomImg2, roomImg3, roomImg4],
    isAvailable: true,
    pricePerNight: 10000000,
    roomType: "Giường Đôi",
    updatedAt: "2025-04-10T06:26:04.013Z",
  },
  {
    __v: 0,
    _id: "67f76452197ac559e4089b8e",
    amenities: ["Dịch Vụ Phòng", "View Núi", "Hồ Bơi"],
    createdAt: "2025-04-10T06:25:22.593Z",
    hotel: hotelDummyData,
    images: [roomImg2, roomImg3, roomImg4, roomImg1],
    isAvailable: true,
    pricePerNight: 7500000,
    roomType: "Giường Đôi",
    updatedAt: "2025-04-10T06:25:22.593Z",
  },
  {
    __v: 0,
    _id: "67f76406197ac559e4089b82",
    amenities: ["WiFi Miễn Phí", "Bữa Sáng Miễn Phí", "Dịch Vụ Phòng"],
    createdAt: "2025-04-10T06:24:06.285Z",
    hotel: hotelDummyData,
    images: [roomImg3, roomImg4, roomImg1, roomImg2],
    isAvailable: true,
    pricePerNight: 6250000,
    roomType: "Giường Đôi",
    updatedAt: "2025-04-10T06:24:06.285Z",
  },
  {
    __v: 0,
    _id: "67f763d8197ac559e4089b7a",
    amenities: ["WiFi Miễn Phí", "Dịch Vụ Phòng", "Hồ Bơi"],
    createdAt: "2025-04-10T06:23:20.252Z",
    hotel: hotelDummyData,
    images: [roomImg4, roomImg1, roomImg2, roomImg3],
    isAvailable: true,
    pricePerNight: 5000000,
    roomType: "Giường Đơn",
    updatedAt: "2025-04-10T06:23:20.252Z",
  },
];

// User Bookings Dummy Data
export const userBookingsDummyData = [
  {
    __v: 0,
    _id: "67f76839994a731e97d3b8ce",
    checkInDate: "2025-04-30T00:00:00.000Z",
    checkOutDate: "2025-05-01T00:00:00.000Z",
    createdAt: "2025-04-10T06:42:01.529Z",
    guests: 1,
    hotel: hotelDummyData,
    isPaid: true,
    paymentMethod: "Stripe",
    room: roomsDummyData[1],
    status: "pending",
    totalPrice: 7500000,
    updatedAt: "2025-04-10T06:43:54.520Z",
    user: userDummyData,
  },
  {
    __v: 0,
    _id: "67f76829994a731e97d3b8c3",
    checkInDate: "2025-04-27T00:00:00.000Z",
    checkOutDate: "2025-04-28T00:00:00.000Z",
    createdAt: "2025-04-10T06:41:45.873Z",
    guests: 1,
    hotel: hotelDummyData,
    isPaid: false,
    paymentMethod: "Thanh Toán Tại Khách Sạn",
    room: roomsDummyData[0],
    status: "pending",
    totalPrice: 10000000,
    updatedAt: "2025-04-10T06:41:45.873Z",
    user: userDummyData,
  },
  {
    __v: 0,
    _id: "67f76810994a731e97d3b8b4",
    checkInDate: "2025-04-11T00:00:00.000Z",
    checkOutDate: "2025-04-12T00:00:00.000Z",
    createdAt: "2025-04-10T06:41:20.501Z",
    guests: 1,
    hotel: hotelDummyData,
    isPaid: false,
    paymentMethod: "Thanh Toán Tại Khách Sạn",
    room: roomsDummyData[3],
    status: "pending",
    totalPrice: 5000000,
    updatedAt: "2025-04-10T06:41:20.501Z",
    user: userDummyData,
  },
];

// Dashboard Dummy Data
export const dashboardDummyData = {
  bookings: userBookingsDummyData,
  totalBookings: 3,
  totalRevenue: 22500000,
};

// --------- SVG code for Book Icon------
/* 
const BookIcon = ()=>(
    <svg className="w-4 h-4 text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" >
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4" />
</svg>
)

*/
