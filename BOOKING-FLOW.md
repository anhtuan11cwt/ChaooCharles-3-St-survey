# Tài liệu luồng hoạt động chức năng Đặt phòng & Thanh toán

## Tổng quan

Chức năng đặt phòng cho phép người dùng chọn phòng, chọn ngày lưu trú, kiểm tra trùng lặp ngày, và thanh toán qua Stripe Checkout. Dữ liệu đặt phòng được lưu vào database và trạng thái thanh toán được cập nhật khi người dùng quay lại trang thành công.

---

## Luồng hoạt động

### 1. Chọn ngày và phòng

```
Người dùng mở trang chi tiết khách sạn (/hotel-details/[hotelId])
  └── Hiển thị danh sách phòng (RoomCard)
        └── Chọn ngày đặt phòng (DateRangePicker)
              ├── Ngày quá khứ → bị disable
              ├── Ngày đã đặt (từ database, paymentStatus: "true") → bị disable
              └── Ngày đặt trước ngày trả → bị disable
```

### 2. Nhấn "Đặt phòng"

```
Người dùng nhấn nút "Đặt phòng"
  └── handleBookRoom() trong RoomCard
        ├── Kiểm tra đã chọn ngày chưa
        ├── Kiểm tra thông tin khách sạn
        ├── Kiểm tra trùng lặp ngày đặt (hasOverlap)
        │     ├── GET /api/booking/{roomId} → lấy bookings đã thanh toán
        │     ├── So sánh với ngày người dùng chọn
        │     └── Nếu trùng → toast lỗi, dừng xử lý
        ├── Gọi POST /api/create-payment-intent
        │     ├── Tạo Stripe Checkout Session
        │     ├── Tạo booking trong database (paymentStatus: "false")
        │     └── Trả về URL thanh toán Stripe
        └── Redirect sang Stripe Checkout Hosted Page
```

### 3. Thanh toán trên Stripe

```
Người dùng ở trang Stripe Checkout
  ├── Nhập thông tin thẻ (test: 4242 4242 4242 4242)
  ├── Nhập ngày hết hạn và CVC
  └── Nhấn "Pay"
        ├── Thanh toán thành công → Redirect về /book-room/success?session_id=...
        └── Thanh toán thất bại → Redirect về /hotel-details/[hotelId]
```

### 4. Xử lý sau thanh toán

```
Trang /book-room/success
  ├── Nhận session_id từ URL
  ├── Gọi POST /api/verify-payment
  │     ├── Lấy Checkout Session từ Stripe
  │     ├── Kiểm tra payment_status === "paid"
  │     └── Cập nhật paymentStatus: "true" trong database
  ├── Hiển thị thông báo "Thanh toán thành công!"
  ├── Hiển thị mã đơn hàng (session_id)
  ├── Nút "Xem đặt phòng" → /my-bookings
  └── Tự động redirect đến /my-bookings sau 3 giây
```

---

## Kiểm tra trùng lặp ngày đặt phòng (Overlap Check)

### Hàm hasOverlap

```
hasOverlap(startDate, endDate, dateRanges)
  ├── Chuẩn hóa khoảng ngày cần kiểm tra
  │     ├── start = startOfDay(startDate)
  │     └── end = endOfDay(endDate)
  ├── Duyệt qua từng khoảng đã đặt (dateRanges)
  │     ├── Trường hợp 1: startDate mới nằm trong khoảng đã đặt
  │     ├── Trường hợp 2: endDate mới nằm trong khoảng đã đặt
  │     └── Trường hợp 3: Khoảng mới bao trùm khoảng đã đặt
  └── Trả về true nếu có trùng, false nếu không
```

### API kiểm tra booking

```
GET /api/booking/{roomId}
  ├── Lọc theo roomId
  ├── Chỉ lấy booking có paymentStatus: "true"
  ├── Chỉ lấy booking có endDate > yesterday
  └── Trả về mảng bookings
```

### Xử lý khi phát hiện trùng lặp

```
handleBookRoom()
  ├── Gọi GET /api/booking/{roomId}
  ├── Map dữ liệu thành dateRanges [{startDate, endDate}]
  ├── Gọi hasOverlap(date.from, date.to, dateRanges)
  └── Nếu overlap = true
        ├── Toast: "Ngày bạn chọn đã có người đặt"
        └── Dừng xử lý, không redirect Stripe
```

---

## Cấu trúc API

### POST `/api/create-payment-intent`

**Mục đích:** Tạo Stripe Checkout Session và booking trong database.

**Request body:**
```json
{
  "booking": {
    "roomId": "string",
    "hotelId": "string",
    "hotelOwnerId": "string",
    "startDate": "ISO string",
    "endDate": "ISO string",
    "totalPrice": 1000000,
    "breakfastIncluded": true
  }
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

**Luồng xử lý:**
1. Xác thực người dùng (getCurrentUser)
2. Lấy thông tin phòng từ database
3. Tạo Stripe Checkout Session với:
   - `line_items`: Thông tin phòng + giá
   - `mode`: "payment"
   - `success_url`: `/book-room/success?session_id={CHECKOUT_SESSION_ID}`
   - `cancel_url`: `/hotel-details/{hotelId}`
   - `metadata`: Thông tin booking
4. Tạo booking trong database với `paymentStatus: "false"`
5. Trả về URL thanh toán

### GET `/api/booking/[id]`

**Mục đích:** Lấy danh sách bookings theo roomId (dùng để kiểm tra trùng lặp).

**Params:** `id` = roomId

**Response:**
```json
[
  {
    "id": "string",
    "startDate": "2026-06-20T00:00:00.000Z",
    "endDate": "2026-06-25T00:00:00.000Z",
    "paymentStatus": "true",
    ...
  }
]
```

**Luồng xử lý:**
1. Kiểm tra id tồn tại
2. Lấy ngày yesterday = today - 1
3. Truy vấn Prisma: `roomId = id`, `paymentStatus = "true"`, `endDate > yesterday`
4. Trả về mảng bookings

### POST `/api/verify-payment`

**Mục đích:** Xác minh thanh toán và cập nhật trạng thái booking.

**Request body:**
```json
{
  "sessionId": "cs_test_..."
}
```

**Response:**
```json
{
  "success": true
}
```

**Luồng xử lý:**
1. Lấy Checkout Session từ Stripe bằng sessionId
2. Kiểm tra `payment_status === "paid"`
3. Nếu đã thanh toán:
   - Tìm booking trong database (theo roomId, userId, startDate)
   - Cập nhật `paymentStatus: "true"` và `paymentIntentId`
4. Trả về kết quả

### PATCH `/api/booking/[id]`

**Mục đích:** Cập nhật trạng thái thanh toán thành công.

**Params:** `id` = paymentIntentId

**Xử lý:**
1. Xác thực người dùng
2. Cập nhật `paymentStatus: "true"` trong database
3. Trả về booking đã cập nhật

---

## Database Schema

### Booking Model

```prisma
model Booking {
  id                String   @id @default(uuid())
  userName          String
  userEmail         String
  userId            String
  hotelId           String
  roomId            String
  hotelOwnerId      String
  startDate         DateTime
  endDate           DateTime
  breakfastIncluded Boolean
  currency          String
  totalPrice        Int
  paymentStatus     String   // "true" hoặc "false"
  paymentIntentId   String   @unique
  bookedAt          DateTime @default(now())
}
```

---

## Component Structure

```
app/
├── hotel-details/[hotelId]/
│   └── page.tsx              # Server component - fetch hotel + bookings
├── book-room/
│   ├── page.tsx              # Redirect về home
│   └── success/
│       └── page.tsx          # Trang thành công + verify payment + auto redirect
└── api/
    ├── create-payment-intent/
    │   └── route.ts          # Tạo Checkout Session
    ├── verify-payment/
    │   └── route.ts          # Xác minh thanh toán từ Stripe
    └── booking/[id]/
        └── route.ts          # GET bookings + PATCH paymentStatus + DELETE

actions/
├── getHotelById.ts           # Lấy hotel theo ID
├── getHotels.ts              # Lấy danh sách hotels
├── getBookings.ts            # Lấy bookings theo hotelId
└── verify-payment.ts         # Xác minh thanh toán qua Stripe API

components/
├── room/
│   ├── room-card.tsx         # Hiển thị phòng + nút đặt phòng + hasOverlap()
│   └── date-range-picker.tsx # Bộ chọn ngày
├── booking/
│   ├── book-room-client.tsx  # Client component cho trang đặt phòng
│   └── room-payment-form.tsx # Form thanh toán Stripe Elements
└── hotel/
    └── hotel-details-client.tsx # Hiển thị chi tiết khách sạn
```

---

## Luồng dữ liệu

```
RoomCard (chọn ngày, nhấn đặt phòng)
  │
  ├── GET /api/booking/{roomId}
  │     └── Lấy bookings đã thanh toán
  │
  ├── hasOverlap() kiểm tra trùng lặp
  │     └── Nếu trùng → toast lỗi, dừng lại
  │
  ├── POST /api/create-payment-intent
  │     ├── Stripe Checkout Session
  │     └── Database: Booking (paymentStatus: "false")
  │
  ├── Redirect → Stripe Checkout
  │     └── Thanh toán thẻ
  │
  ├── Success → /book-room/success?session_id=...
  │     ├── POST /api/verify-payment
  │     │     ├── Stripe: retrieve session
  │     │     ├── Kiểm tra payment_status === "paid"
  │     │     └── Database: Booking (paymentStatus: "true")
  │     └── Auto redirect → /my-bookings (3s)
  │
  └── Cancel → /hotel-details/[hotelId]
```

---

## Kiểm soát ngày đã đặt

```
disabledDates (useMemo)
  ├── Lọc bookings theo roomId
  ├── Dùng eachDayOfInterval để tạo mảng ngày
  ├── Kết hợp ngày quá khứ
  └── Kết hợp ngày trước date.from (khi đã chọn ngày đặt)
```

---

## Environment Variables

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Thẻ test Stripe

| Thông tin | Giá trị |
|-----------|---------|
| Số thẻ | 4242 4242 4242 4242 |
| Ngày hết hạn | Bất kỳ trong tương lai |
| CVC | Bất kỳ |

---

## Lưu ý

- Chỉ booking có `paymentStatus: "true"` mới được coi là đã thanh toán
- Ngày đã có booking (đã thanh toán) sẽ bị disable trên calendar
- Kiểm tra trùng lặp chỉ xét các booking có `paymentStatus: "true"` và `endDate > yesterday`
- Dữ liệu booking được lưu ngay khi tạo Checkout Session, trước khi thanh toán
- Stripe Checkout Hosted Page xử lý hoàn toàn việc nhập thông tin thẻ
- Trạng thái thanh toán được cập nhật khi user quay lại trang success (không dùng webhook)
- Nếu user đóng trình duyệt trước khi quay lại trang success, paymentStatus sẽ không được cập nhật
- Hàm `hasOverlap` kiểm tra 3 trường hợp: start trong range, end trong range, range mới bao trùm range cũ
