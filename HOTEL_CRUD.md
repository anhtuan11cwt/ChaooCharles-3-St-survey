# Tài liệu Hotel CRUD

Tài liệu này mô tả các chức năng CRUD (Create, Read, Update, Delete) cho quản lý khách sạn trong ứng dụng.

## Tổng quan

Hệ thống quản lý khách sạn hỗ trợ đầy đủ các thao tác CRUD với tích hợp upload ảnh qua UploadThing và quản lý địa điểm Việt Nam.

## Kiến trúc

### File chính

| File | Mô tả |
|------|-------|
| `components/hotel/addHotelForm.tsx` | Component form CRUD chính |
| `app/api/hotel/route.ts` | API POST (Tạo mới) |
| `app/api/hotel/[hotelId]/route.ts` | API PATCH (Cập nhật) & DELETE (Xóa) |
| `app/api/uploadthing/core.ts` | Cấu hình UploadThing router |
| `app/api/uploadthing/route.ts` | Route handler UploadThing |
| `app/api/uploadthing/delete/route.ts` | API xóa file trên UploadThing |
| `hooks/useLocation.ts` | Hook lấy dữ liệu địa điểm Việt Nam |

### Schema dữ liệu (Prisma)

```
Hotel
├── id: String (UUID)         @id @default(uuid())
├── userId: String            @db.Text
├── title: String             @db.Text           (Bắt buộc)
├── description: String       @db.LongText       (Bắt buộc)
├── image: String                                (Bắt buộc)
├── state: String                                (Bắt buộc) - ID Tỉnh/Thành phố
├── city: String                                 (Bắt buộc) - ID Quận/Huyện
├── locationDescription: String @db.LongText     (Bắt buộc)
├── bar: Boolean              @default(false)
├── bikeRental: Boolean        @default(false)
├── coffeeShop: Boolean       @default(false)
├── freeParking: Boolean      @default(false)
├── freeWifi: Boolean         @default(false)
├── gym: Boolean              @default(false)
├── laundry: Boolean           @default(false)
├── movieNight: Boolean       @default(false)
├── restaurant: Boolean       @default(false)
├── shopping: Boolean         @default(false)
├── spa: Boolean              @default(false)
├── swimmingPool: Boolean     @default(false)
├── createdAt: DateTime       @default(now())
├── updatedAt: DateTime       @updatedAt
└── rooms: Room[]
```

### Schema Validation (Zod)

Tất cả trường đều **bắt buộc** trong form validation:

| Trường | Validation | Lỗi hiển thị |
|--------|-----------|-------------|
| `title` | `.min(3)` | "Tiêu đề phải có ít nhất 3 ký tự" |
| `description` | `.min(10)` | "Mô tả phải có ít nhất 10 ký tự" |
| `image` | `.min(1)` | "Vui lòng chọn ảnh khách sạn" |
| `state` | `.min(1)` | "Vui lòng chọn tỉnh/thành phố" |
| `city` | `.min(1)` | "Vui lòng chọn quận/huyện" |
| `locationDescription` | `.min(10)` | "Mô tả vị trí phải có ít nhất 10 ký tự" |
| `bar`, `gym`, `spa`... | `.boolean()` | — (có giá trị mặc định) |
| **Tiện ích (tổng)** | `.refine()` | "Vui lòng chọn ít nhất một tiện ích" |

```typescript
const formSchema = z.object({
  bar: z.boolean(),
  bikeRental: z.boolean(),
  city: z.string().min(1),
  coffeeShop: z.boolean(),
  description: z.string().min(10),
  freeParking: z.boolean(),
  freeWifi: z.boolean(),
  gym: z.boolean(),
  image: z.string().min(1),
  laundry: z.boolean(),
  locationDescription: z.string().min(10),
  movieNight: z.boolean(),
  restaurant: z.boolean(),
  shopping: z.boolean(),
  spa: z.boolean(),
  state: z.string().min(1),
  swimmingPool: z.boolean(),
  title: z.string().min(3),
}).refine(
  (data) => data.bar || data.bikeRental || data.coffeeShop || data.freeParking ||
            data.freeWifi || data.gym || data.laundry || data.movieNight ||
            data.restaurant || data.shopping || data.spa || data.swimmingPool,
  { message: "Vui lòng chọn ít nhất một tiện ích", path: ["amenities"] }
);
```

## Create (Tạo mới)

### Mô tả
Tạo khách sạn mới. Tất cả trường đều bắt buộc.

### Quy trình
1. Người dùng điền form đầy đủ các thông tin:
   - **Tiêu đề** (min 3 ký tự)
   - **Mô tả** (min 10 ký tự)
   - **Ảnh** (JPG/PNG, tối đa 4MB)
   - **Tỉnh/Thành phố** (Select)
   - **Quận/Huyện** (Select, phụ thuộc tỉnh)
   - **Mô tả vị trí** (min 10 ký tự)
   - **Tiện ích** (ít nhất 1 checkbox)
2. Nhấn **"Tạo khách sạn"**
3. Hệ thống:
   - Validate Zod → nếu thiếu trường nào, hiển thị lỗi và không submit
   - Upload ảnh lên UploadThing
   - Nhận URL ảnh (`ufsUrl`)
   - POST `/api/hotel` với dữ liệu + URL ảnh
   - Chuyển hướng đến trang chi tiết khách sạn

### Xử lý ảnh trong form
```typescript
// Khi chọn file preview
handleFileChange = (e) => {
  const file = e.target.files?.[0];
  selectedFileRef.current = file;
  setPreviewUrl(URL.createObjectURL(file));
  form.setValue("image", "pending-upload", { shouldValidate: false });
};

// Khi xóa ảnh
handleRemoveImage = () => {
  selectedFileRef.current = null;
  setPreviewUrl("");
  form.setValue("image", "", { shouldTouch: true, shouldValidate: true });
};

// Khi submit
if (selectedFileRef.current) {
  const uploadResult = await startUpload([selectedFileRef.current]);
  imageUrl = uploadResult?.[0]?.ufsUrl ?? "";
} else {
  imageUrl = values.image ?? "";
  if (imageUrl === "pending-upload") imageUrl = "";
}
```

### API
```
POST /api/hotel
Content-Type: application/json

Body:
{
  "title": "Khách sạn Biển",
  "description": "Mô tả chi tiết...",
  "image": "https://i73iabx3j5.ufs.sh/f/...",
  "state": "01",
  "city": "001",
  "locationDescription": "Mô tả vị trí...",
  "swimmingPool": true,
  "gym": false,
  ...
}
```

### Response
```json
{
  "id": "8a8724e0-5873-44eb-9efb-136061401ec7",
  "title": "Khách sạn Biển",
  "image": "https://i73iabx3j5.ufs.sh/f/...",
  "state": "01",
  "city": "001",
  ...
}
```

## Read (Đọc)

### Mô tả
Hiển thị thông tin khách sạn trong form để xem và chỉnh sửa.

### Quy trình
1. Truy cập `/hotel/[hotelId]`
2. Server lấy dữ liệu khách sạn từ Prisma
3. Truyền xuống `AddHotelForm` qua prop `hotel`
4. Form được điền sẵn dữ liệu hiện tại (bao gồm ảnh, tỉnh, huyện, tiện ích)

### Dữ liệu hiển thị
- Tiêu đề, mô tả, ảnh, vị trí
- Tỉnh/Thành phố và Quận/Huyện (đã chọn)
- Tiện ích đã chọn (checkbox checked)
- Mô tả vị trí

## Update (Cập nhật)

### Mô tả
Cập nhật thông tin khách sạn. Hỗ trợ đổi ảnh mới (tự động xóa ảnh cũ trên UploadThing).

### Quy trình
1. Form đã điền sẵn dữ liệu hiện tại
2. Người dùng chỉnh sửa các trường
3. **Trường hợp đổi ảnh**:
   - Chọn ảnh mới
   - Hệ thống **xóa ảnh cũ** trên UploadThing trước
   - Upload ảnh mới
   - Nhận URL ảnh mới
4. Nhấn **"Cập nhật"**
5. Hệ thống:
   - Validate Zod (tất cả trường bắt buộc)
   - PATCH `/api/hotel/[hotelId]`
   - Chuyển hướng đến trang chi tiết

### Xóa ảnh cũ trên UploadThing
```typescript
if (hotel?.image) {
  const oldImageKey = hotel.image.substring(hotel.image.lastIndexOf("/") + 1);
  await axios.post("/api/uploadthing/delete", { imageKey: oldImageKey });
}
```

### API
```
PATCH /api/hotel/[hotelId]
Content-Type: application/json

Body:
{
  "title": "Khách sạn Biển Cập Nhật",
  "description": "Mô tả mới...",
  "image": "https://i73iabx3j5.ufs.sh/f/...",
  "state": "01",
  "city": "001",
  "locationDescription": "Mô tả vị trí mới...",
  "swimmingPool": true,
  "gym": true,
  ...
}
```

## Delete (Xóa)

### Mô tả
Xóa khách sạn khỏi hệ thống. Đồng thời xóa ảnh trên UploadThing.

### Quy trình
1. Trang cập nhật hiển thị nút **"Xóa"** (màu đỏ)
2. Nhấn nút xóa
3. Hệ thống:
   - Trích xuất `imageKey` từ URL ảnh
   - Gọi `POST /api/uploadthing/delete` để xóa ảnh
   - Gọi `DELETE /api/hotel/[hotelId]` để xóa DB
   - Chuyển hướng đến `/hotel/new`

### API
```
DELETE /api/hotel/[hotelId]

Response: { id, title, ... }
```

## Upload Anh

### Cấu hình UploadThing
- **Endpoint**: `imageUploader`
- **Max file size**: 4MB
- **Max file count**: 1
- **Middleware**: Kiểm tra đăng nhập
- **onUploadComplete**: Trả về `{ uploadedBy, url }`

### Xử lý lỗi callback
Trong môi trường dev, UploadThing có thể gặp lỗi callback. Đã xử lý bằng cách:
- Exclude `/api/uploadthing` trong `proxy.ts` matcher
- Proxy không can thiệp request callback

### Quy trình upload
```
1. Chọn file → hiển thị preview (URL.createObjectURL)
2. Submit form → gọi startUpload()
3. Upload lên server → nhận presigned URL
4. Upload lên S3 → nhận ufsUrl
5. Lưu URL vào DB
```

## Quan ly Dia diem

### Dữ liệu nguồn
Sử dụng thư viện `vietnam-divisions-js` thay vì `country-state-city`

### Flow
```
1. Load page → fetchAllProvinces() → đổ vào Select Tỉnh
2. Chọn Tỉnh → fetchDistrictsByProvinceId(provinceId) → đổ vào Select Huyện
3. Giá trị lưu: ID ("01", "001") thay vì tên
```

### API dữ liệu
```typescript
// hooks/useLocation.ts
interface Province {
  idProvince: string;   // "01"
  name: string;         // "Thành phố Hà Nội"
}

interface District {
  idDistrict: string;   // "001"
  name: string;         // "Quận Ba Đình"
}
```

## UI/UX

### Trạng thái Loading
Khi đang xử lý (`isLoading` hoặc `isDeleting`):
- Toàn bộ form: opacity 80% + pointer-events-none
- Input: `disabled`
- Select: `disabled`
- Checkbox: `disabled`
- Nút xóa ảnh: `disabled`
- Transition: 300ms

### Nút bấm
| Chế độ | Nút chính | Nút phụ |
|--------|-----------|---------|
| Tạo mới | **Tạo khách sạn** | — |
| Cập nhật | **Cập nhật** | **Xóa** (destructive), **Xem** (outline) |

### Label bắt buộc
Tất cả trường bắt buộc có dấu `*` màu đỏ:
- **Tiêu đề khách sạn** *
- **Mô tả khách sạn** *
- **Hình ảnh khách sạn** *
- **Tỉnh/Thành phố** *
- **Quận/Huyện** *
- **Mô tả vị trí** *
- **Chọn tiện ích** * (ít nhất 1)

## Xac thuc & Bao mat

### Proxy (middleware)
- Kiểm tra session token (JWT) trong cookie
- Chặn truy cập nếu chưa đăng nhập
- Redirect về `/sign-in`
- Exclude `/api/uploadthing` khỏi proxy matcher

### API Route
- `getCurrentUser()` kiểm tra đăng nhập
- Trả về `401` nếu không được phép
- UploadThing middleware cũng kiểm tra user

### UploadThing
- Chỉ người dùng đã đăng nhập mới upload được
- Token mã hóa trong `UPLOADTHING_TOKEN`

## Hook tu chinh

### useLocation
```typescript
const { fetchAllProvinces, fetchDistrictsByProvinceId } = useLocation();

// Lấy danh sách tỉnh
const provinces = await fetchAllProvinces();

// Lấy danh sách huyện theo tỉnh
const districts = await fetchDistrictsByProvinceId("01");
```

## Dependencies

```json
{
  "@uploadthing/react": "^7.3.3",
  "uploadthing": "^7.7.4",
  "vietnam-divisions-js": "^3.0.0",
  "react-hook-form": "^7.78.0",
  "@hookform/resolvers": "^5.4.0",
  "zod": "^4.4.3",
  "axios": "^1.17.0",
  "react-hot-toast": "^2.6.0"
}
```

## Ghi chu

- Ảnh sử dụng `next/image` với hostname `*.ufs.sh` và `utfs.io` đã cấu hình trong `next.config.ts`
- Form sử dụng `shadcn/ui` components với Radix theme
- Validation bằng Zod schema
- React Hook Form quản lý state form
- Toast hiển thị thông báo thành công/lỗi
- Tất cả trường trong form đều **bắt buộc** (không có trường tùy chọn)
- Tiện ích yêu cầu **ít nhất 1 checkbox** được chọn
- Đổi ảnh khi cập nhật sẽ **tự động xóa ảnh cũ** trên UploadThing
