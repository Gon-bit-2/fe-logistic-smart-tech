# Frontend Integration Guide

Tài liệu này tập trung vào cách frontend web tích hợp với backend hiện tại.

## 1. Env gợi ý cho frontend

```env
VITE_API_BASE_URL=http://localhost:8386
VITE_GOOGLE_LOGIN_ENABLED=true
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

`STRIPE_PUBLISHABLE_KEY` không có trong backend repo này, nên cần lấy riêng từ môi trường deploy hoặc backend/ops.

## 2. Auth strategy

### Token storage

- Lưu `accessToken`
- Lưu `refreshToken`
- Mỗi request private gắn:

```http
Authorization: Bearer <accessToken>
```

### Refresh strategy

- Khi gặp `401`, gọi `POST /auth/refresh-token`
- Body:

```json
{
  "refreshToken": "..."
}
```

- Sau khi refresh thành công, phải cập nhật lại:
  - `accessToken`
  - `refreshToken`

### Logout

- Gọi `POST /auth/logout`
- Body:

```json
{
  "refreshToken": "..."
}
```

## 3. Luồng auth nên triển khai

### Register

1. `POST /auth/otp` với `type=REGISTER`
2. User nhập OTP
3. `POST /auth/register`
4. Chuyển sang màn login

### Forgot password

1. `POST /auth/otp` với `type=FORGOT_PASSWORD`
2. User nhập OTP
3. `POST /auth/forgot-password`

### Google login

1. `GET /auth/google-link`
2. Redirect browser sang `url`
3. Sau callback, frontend đọc query params:
   - `accessToken`
   - `refreshToken`
   - hoặc `errorMessage`

## 4. Axios setup mẫu

```ts
import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken')
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})
```

Refresh interceptor gợi ý:

```ts
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status !== 401 || originalRequest?._retry) {
      throw error
    }

    originalRequest._retry = true

    const refreshToken = localStorage.getItem('refreshToken')
    const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`, { refreshToken })

    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)

    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
    return api(originalRequest)
  },
)
```

## 5. Error handling

Backend hiện chưa đồng nhất error response. `message` có thể là:

- string
- array validation issues
- object

Frontend nên normalize:

```ts
export function extractApiMessage(error: any): string {
  const message = error?.response?.data?.message

  if (typeof message === 'string') return message
  if (Array.isArray(message)) {
    return message.map((item) => item?.message ?? String(item)).join(', ')
  }
  if (message && typeof message === 'object') {
    return message.message ?? JSON.stringify(message)
  }

  return 'Request failed'
}
```

## 6. Enum quan trọng cho UI

### VerificationCodeType

- `REGISTER`
- `FORGOT_PASSWORD`
- `LOGIN`

### VehicleType

- `VAN`
- `TRUCK`
- `ELECTRIC_VAN`
- `MOTORCYCLE`

### FuelType

- `DIESEL`
- `ELECTRIC`
- `GASOLINE`

### OrderStatus

- `PENDING`
- `ASSIGNED`
- `PICKED_UP`
- `IN_TRANSIT`
- `ARRIVED_AT_HUB`
- `OUT_FOR_DELIVERY`
- `DELIVERED`
- `CANCELLED`

### TrackingEventType

- `STATUS_CHANGE`
- `SCAN`
- `NOTE`
- `POD`
- `EXCEPTION`
- `ETA_UPDATE`

### PaymentStatus

- `PENDING`
- `COMPLETED`
- `FAILED`
- `REFUNDED`

## 7. Màn hình frontend có thể triển khai ngay

### Public

- Login
- Register
- Forgot password
- Public tracking theo `trackingCode`

### Customer

- Thanh toán Stripe cho order đã có backend support
- Xem payment status theo `orderId`

### Admin

- CRUD vehicles
- CRUD hubs
- Gán / gỡ staff khỏi hub
- CRUD language
- Force calculate emission
- Xem emission log theo trip

### Driver / Warehouse

- Tạo tracking event
- Xem timeline tracking nội bộ
- Driver confirm COD

## 8. Những màn chưa nên làm ngay

Chưa nên code production integration cho:

- `/orders`
- `/trips`

Lý do: hai module này chưa mount vào `AppModule`, nên route chưa chạy trong runtime hiện tại.

## 9. Caveat runtime cần biết

1. `AuthenticationGuard` có source nhưng chưa được wire đầy đủ ở runtime, nên auth enforcement hiện tại chưa đồng bộ với design dự kiến.
2. `HubRepository.findAll()` chưa lọc `deletedAt` và `isActive`, nên list hub có thể lẫn hub không còn hợp lệ.
3. `POST /hubs/:id/staff` trả raw Prisma record; frontend chỉ nên dùng field an toàn.
4. `LanguageService` đang throw `Error` generic, có thể tạo ra `500`.
5. `POST /payments/webhook` cần raw body để verify Stripe signature, nhưng bootstrap app chưa bật `rawBody`.

## 10. Tài liệu liên quan

- API reference chi tiết: [api-reference.md](./api-reference.md)
