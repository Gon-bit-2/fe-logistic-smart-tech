# API Reference

Tài liệu này được viết từ source backend hiện tại tại ngày `2026-04-15`.

## Tổng quan runtime

- Base URL local: `http://localhost:8386`
- Không có prefix `/api`
- CORS bật toàn cục
- Response là JSON, `Date` serialize thành ISO string
- Pagination chuẩn:
  - `page`: mặc định `1`
  - `limit`: mặc định `10`
  - `limit`: tối đa `100`

## API đang được mount

Các module đang được import trong `src/app.module.ts`:

- `auth`
- `vehicles`
- `hubs`
- `language`
- `tracking-events`
- `green-tech`
- `payments`

## API có trong source nhưng chưa publish

Hai nhóm sau có controller/service nhưng hiện chưa được import vào `AppModule`:

- `orders`
- `trips`

Frontend không nên gọi hai nhóm này cho tới khi backend mount lại module.

## 1. Auth

| Method | Path                    | Public | Mục đích                  | Response chính                  |
| ------ | ----------------------- | ------ | ------------------------- | ------------------------------- |
| POST   | `/auth/otp`             | Yes    | Gửi OTP                   | `{ message }`                   |
| POST   | `/auth/verify-otp`      | Yes    | Verify OTP                | `{ message }`                   |
| POST   | `/auth/register`        | Yes    | Đăng ký customer          | user public                     |
| POST   | `/auth/login`           | Yes    | Đăng nhập                 | `{ accessToken, refreshToken }` |
| POST   | `/auth/refresh-token`   | Yes    | Refresh token             | `{ accessToken, refreshToken }` |
| POST   | `/auth/logout`          | No     | Logout theo refresh token | `{ message }`                   |
| GET    | `/auth/google-link`     | Yes    | Lấy URL Google OAuth      | `{ url }`                       |
| GET    | `/auth/google/callback` | Yes    | Redirect từ Google        | `302 redirect`                  |
| POST   | `/auth/forgot-password` | Yes    | Đổi mật khẩu bằng OTP     | `{ message }`                   |

### Body mẫu

`POST /auth/otp`

```json
{
  "email": "user@example.com",
  "type": "REGISTER"
}
```

`POST /auth/register`

```json
{
  "email": "user@example.com",
  "password": "Secret123",
  "confirmPassword": "Secret123",
  "fullName": "Nguyen Van A",
  "phone": "0900000000",
  "code": "123456"
}
```

`POST /auth/login`

```json
{
  "email": "user@example.com",
  "password": "Secret123"
}
```

Response login:

```json
{
  "accessToken": "jwt-access-token",
  "refreshToken": "jwt-refresh-token"
}
```

### Ghi chú

- `POST /auth/otp` bị throttle `1 request / 60s`.
- Google OAuth callback không trả JSON, mà redirect về `GOOGLE_CLIENT_REDIRECT_URI` với query:
  - `accessToken`
  - `refreshToken`
  - hoặc `errorMessage`
- `refresh-token` đang dùng rotation, frontend phải ghi đè cả access token lẫn refresh token sau mỗi lần refresh.

## 2. Vehicles

| Method | Path            | Quyền dự kiến | Mục đích     | Response chính          |
| ------ | --------------- | ------------- | ------------ | ----------------------- |
| GET    | `/vehicles`     | ADMIN         | Danh sách xe | `{ data, totalItems }`  |
| POST   | `/vehicles`     | ADMIN         | Tạo xe       | vehicle                 |
| GET    | `/vehicles/:id` | ADMIN         | Chi tiết xe  | vehicle                 |
| PATCH  | `/vehicles/:id` | ADMIN         | Cập nhật xe  | vehicle                 |
| DELETE | `/vehicles/:id` | ADMIN         | Xóa mềm xe   | vehicle sau soft-delete |

Query của `GET /vehicles`:

- `page`
- `limit`
- `type`: `VAN | TRUCK | ELECTRIC_VAN | MOTORCYCLE`
- `fuelType`: `DIESEL | ELECTRIC | GASOLINE`
- `isActive`
- `search`

Body tạo xe:

```json
{
  "licensePlate": "51A-12345",
  "type": "TRUCK",
  "fuelType": "DIESEL",
  "capacityWeight": 1500,
  "capacityVolume": 12,
  "emissionRatePerKm": 250,
  "hubId": 1
}
```

## 3. Hubs

| Method | Path                      | Quyền dự kiến | Mục đích          | Response chính           |
| ------ | ------------------------- | ------------- | ----------------- | ------------------------ |
| GET    | `/hubs`                   | Authenticated | Danh sách hub     | `{ data, totalItems }`   |
| POST   | `/hubs`                   | ADMIN         | Tạo hub           | hub                      |
| GET    | `/hubs/:id`               | Authenticated | Chi tiết hub      | hub + `staff` + `_count` |
| PATCH  | `/hubs/:id`               | ADMIN         | Cập nhật hub      | hub                      |
| DELETE | `/hubs/:id`               | ADMIN         | Xóa mềm hub       | `{ message }`            |
| POST   | `/hubs/:id/staff`         | ADMIN         | Gán staff vào hub | user record              |
| DELETE | `/hubs/:id/staff/:userId` | ADMIN         | Gỡ staff khỏi hub | `{ message }`            |

Body tạo hub:

```json
{
  "code": "SGN-HUB-01",
  "name": "Tan Binh Hub",
  "address": "123 Nguyen Van Troi, HCM",
  "latitude": 10.801,
  "longitude": 106.667
}
```

Ghi chú:

- `GET /hubs/:id` trả thêm:
  - `staff`: danh sách nhân viên kho
  - `_count.vehicles`: số lượng xe thuộc hub
- Runtime hiện tại của `POST /hubs/:id/staff` trả raw Prisma user record. Frontend chỉ nên rely vào:
  - `id`
  - `email`
  - `fullName`
  - `phone`
  - `hubId`
  - `roleId`

## 4. Language

| Method | Path                    | Quyền dự kiến | Mục đích           | Response chính         |
| ------ | ----------------------- | ------------- | ------------------ | ---------------------- |
| GET    | `/language`             | Authenticated | Danh sách ngôn ngữ | `{ data, totalItems }` |
| POST   | `/language`             | Authenticated | Tạo ngôn ngữ       | language               |
| GET    | `/language/:languageId` | Authenticated | Chi tiết ngôn ngữ  | language               |
| PUT    | `/language/:languageId` | Authenticated | Cập nhật ngôn ngữ  | language               |
| DELETE | `/language/:languageId` | Authenticated | Xóa mềm ngôn ngữ   | `{ message }`          |

Body tạo ngôn ngữ:

```json
{
  "id": "vi",
  "name": "Vietnamese",
  "code": "vi-VN"
}
```

Lưu ý:

- `LanguageService` hiện throw `Error` generic ở một số nhánh, nên runtime có thể trả `500` thay vì `404/409`.

## 5. Tracking

| Method | Path                                    | Quyền dự kiến                    | Mục đích        | Response chính                            |
| ------ | --------------------------------------- | -------------------------------- | --------------- | ----------------------------------------- |
| POST   | `/tracking-events`                      | DRIVER / WAREHOUSE_STAFF / ADMIN | Tạo event       | tracking event vừa tạo                    |
| GET    | `/tracking-events?orderId=...`          | Authenticated                    | Timeline nội bộ | `{ trackingCode, currentStatus, events }` |
| GET    | `/tracking-events/public/:trackingCode` | Public                           | Timeline public | `{ trackingCode, currentStatus, events }` |

Body tạo tracking event:

```json
{
  "orderId": 1001,
  "eventType": "STATUS_CHANGE",
  "status": "OUT_FOR_DELIVERY",
  "source": "DRIVER_APP",
  "latitude": 10.77,
  "longitude": 106.69,
  "location": "Quan 1, HCM",
  "description": "Tai xe dang giao hang"
}
```

Nếu giao thành công:

```json
{
  "orderId": 1001,
  "eventType": "STATUS_CHANGE",
  "status": "DELIVERED",
  "source": "DRIVER_APP",
  "pod": {
    "receiverName": "Tran Thi B",
    "packageCondition": "INTACT",
    "images": [
      {
        "url": "https://cdn.example.com/pod-1.jpg",
        "type": "PACKAGE"
      }
    ]
  }
}
```

Rule nghiệp vụ:

- `STATUS_CHANGE` bắt buộc có `status`
- `EXCEPTION` bắt buộc có `failureReasonCode`
- `status = DELIVERED` bắt buộc có `pod`
- public timeline sẽ ẩn bớt thông tin nhạy cảm

## 6. Green Tech

| Method | Path                            | Quyền dự kiến  | Mục đích            | Response chính          |
| ------ | ------------------------------- | -------------- | ------------------- | ----------------------- |
| POST   | `/green-tech/calculate/:tripId` | ADMIN          | Force tính emission | emission log mới        |
| GET    | `/green-tech/trips/:tripId`     | ADMIN / DRIVER | Lịch sử emission    | danh sách emission logs |

Response emission log gồm các field chính:

- `tripId`
- `version`
- `isLatest`
- `actualDistance`
- `payloadWeight`
- `co2Emitted`
- `co2Saved`
- `emissionFactor`
- `baselineRate`
- `vehicleType`
- `fuelType`
- `calculationMethod`
- `ghgScope`
- `calculatedAt`

## 7. Payments

| Method | Path                               | Quyền dự kiến                               | Mục đích               | Response chính                            |
| ------ | ---------------------------------- | ------------------------------------------- | ---------------------- | ----------------------------------------- |
| POST   | `/payments/create-intent/:orderId` | CUSTOMER                                    | Tạo Stripe intent      | `{ clientSecret, transactionId, amount }` |
| POST   | `/payments/cod-confirm/:orderId`   | DRIVER                                      | Xác nhận COD           | `{ success, message }`                    |
| GET    | `/payments/order/:orderId`         | CUSTOMER / DRIVER / ADMIN / WAREHOUSE_STAFF | Lấy trạng thái payment | payment hoặc `null`                       |
| POST   | `/payments/webhook`                | Public                                      | Stripe callback        | `{ received: true }`                      |

Response `create-intent`:

```json
{
  "clientSecret": "pi_..._secret_...",
  "transactionId": "pi_...",
  "amount": 45000
}
```

Response `cod-confirm`:

```json
{
  "success": true,
  "message": "Đã xác nhận thu hộ tiền mặt (COD) thành công"
}
```

Lưu ý:

- `GET /payments/order/:orderId` có thể trả `null` nếu order chưa có payment record.
- Webhook Stripe yêu cầu header `stripe-signature`.

## 8. Error format hiện tại

Backend chưa có 1 error envelope thống nhất, frontend nên chịu được cả 3 dạng:

1. `message` là string
2. `message` là array validation issues
3. `message` là object

Ví dụ validation:

```json
{
  "statusCode": 422,
  "message": [
    {
      "message": "Mã OTP không hợp lệ",
      "path": "code"
    }
  ],
  "error": "Unprocessable Entity"
}
```

## 9. Caveat quan trọng

1. `OrdersModule` và `TripsModule` chưa mount.
2. `AuthenticationGuard` có source nhưng chưa được wire đầy đủ ở runtime.
3. `HubRepository.findAll()` hiện chưa lọc `deletedAt` và `isActive`.
4. `LanguageService` có thể trả `500` do throw `Error` generic.
5. `Payment webhook` đang cần raw body nhưng bootstrap app chưa bật `rawBody`.
