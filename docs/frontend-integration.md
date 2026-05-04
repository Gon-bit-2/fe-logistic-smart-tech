# Frontend integration

## Env

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8386
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
NEXT_PUBLIC_GOONG_MAPS_TILES_KEY=...
```

`NEXT_PUBLIC_API_BASE_URL` là nguồn chính cho REST API và Socket.IO namespace.

## API client

`src/lib/api/http-client.ts`:

- Tự gắn bearer token nếu session còn hợp lệ.
- Tự refresh token khi access token gần hết hạn hoặc API trả `401`.
- Gom nhiều refresh request bằng một `refreshPromise`.
- Ném ra `ApiError` đã normalize để UI xử lý thống nhất.

## Socket tracking

`src/features/tracking/presentation/lib/tracking-socket.manager.ts` giữ socket theo `url + token`.

Luồng dùng:

1. Hook gọi `acquireTrackingSocket`.
2. Component join các trip room cần theo dõi.
3. Cleanup leave room và gọi `releaseTrackingSocket`.
4. Socket disconnect trễ một nhịp ngắn để tránh reconnect liên tục khi chuyển route.

## Mapping dữ liệu

Backend có thể trả summary hoặc detail tùy endpoint. Mapper trong `application/mappers` chịu trách nhiệm fallback field:

- Orders list không luôn có `items/payment`.
- Trips list có thể chỉ có `orderCount`, `driver`, `vehicle`.
- Trip detail mới có `stops.order` đầy đủ.

Không đọc trực tiếp DTO backend trong component nếu có mapper/use-case sẵn.
