# Logistic Green Tech Frontend

Frontend của hệ thống logistics xanh, xây bằng Next.js App Router. Ứng dụng này cung cấp các màn hình cho khách hàng, tài xế, kho và admin; kết nối trực tiếp với backend NestJS qua REST API và Socket.IO.

## Mục tiêu

- Tra cứu đơn hàng public và theo dõi nội bộ.
- Tạo đơn, checkout Stripe, theo dõi COD.
- Vận hành dashboard cho admin, warehouse và driver.
- Hiển thị bản đồ, route, tracking timeline và trạng thái chuyến xe.
- Hỗ trợ đa ngôn ngữ `vi` / `en`.

## Stack chính

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- TanStack Query
- Next Intl
- Stripe Elements
- Playwright + Vitest
- Socket.IO Client
- Goong Maps / Google Maps bridge

## Cấu trúc chính

```text
frontend/
├── public/              Ảnh tĩnh, asset, icon
├── src/
│   ├── app/             App Router, layout, page, providers
│   ├── components/      Shared UI và layout dùng chung
│   ├── features/        Chia theo domain nghiệp vụ
│   │   ├── admin
│   │   ├── analytics
│   │   ├── auth
│   │   ├── fleet
│   │   ├── green-tech
│   │   ├── landing
│   │   ├── language
│   │   ├── maps
│   │   ├── notifications
│   │   ├── orders
│   │   ├── payments
│   │   ├── profile
│   │   ├── role-requests
│   │   ├── tracking
│   │   ├── trips
│   │   └── warehouses
│   ├── i18n/            Dictionary, routing và locale config
│   ├── lib/             API client, env helper, query client
│   ├── test/            Test helper
│   ├── types/           Type dùng chung
│   └── utils/           Formatter và helper thuần
├── tests/               Playwright e2e
└── docs/                Tài liệu tích hợp và test report
```

## Yêu cầu môi trường

- Node.js phù hợp với Next.js 16
- Backend chạy sẵn để frontend có API base URL hợp lệ
- Key cho Stripe frontend nếu dùng checkout online
- Key cho Goong Maps nếu cần render bản đồ tuyến đường

## Biến môi trường quan trọng

Hiện tại frontend đọc chủ yếu các biến sau:

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_GOONG_MAPS_TILES_KEY`
- `NEXT_DIST_DIR` nếu cần đổi thư mục build output

Ghi chú:

- `NEXT_PUBLIC_API_BASE_URL` là biến quan trọng nhất cho toàn bộ luồng API.
- Nếu thiếu `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, màn checkout vẫn render nhưng sẽ báo Stripe chưa được cấu hình.
- Nếu thiếu `NEXT_PUBLIC_GOONG_MAPS_TILES_KEY`, app vẫn chạy nhưng các màn map sẽ hiện fallback thay vì bản đồ thật.

## Chạy local

### 1. Cài dependency

```bash
npm install
```

### 2. Chuẩn bị `.env`

Ví dụ tối thiểu:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8386
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
NEXT_PUBLIC_GOONG_MAPS_TILES_KEY=your_goong_tiles_key
```

### 3. Chạy development

```bash
npm run dev
```

Ứng dụng mặc định chạy tại:

```txt
http://localhost:3000
```

## Scripts hay dùng

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test:unit
npm run test:coverage
npm run test:e2e:mock
npm run test:e2e:live
npm run test:all
```

## Testing

- `npm run test:unit`: chạy Vitest
- `npm run test:coverage`: unit test kèm coverage
- `npm run test:e2e:mock`: Playwright e2e với môi trường mock
- `npm run test:e2e:live`: Playwright e2e với backend thật
- `npm run test:all`: build + toàn bộ test frontend

## Luồng nghiệp vụ nổi bật

- Auth và session client/server.
- Dashboard cho `admin`, `warehouse`, `driver`, `customer`.
- Order creation + quote + checkout Stripe.
- Tracking public và internal tracking.
- Realtime GPS / trip tracking qua Socket.IO.
- Role request, notification và analytics.

## Tài liệu liên quan

- [docs/frontend-integration.md](docs/frontend-integration.md)
- [docs/api-reference.md](docs/api-reference.md)
- [docs/backend-goong-integration-requirements.md](docs/backend-goong-integration-requirements.md)
- [docs/test-report.md](docs/test-report.md)

## Ghi chú kỹ thuật

- App dùng App Router với segment theo locale.
- `src/app/providers.tsx` chứa Query Client, React Query Devtools và bootstrap auth store.
- `src/i18n` quản lý route locale-aware và dictionary `vi` / `en`.
- Nhiều màn hình phụ thuộc backend thật; khi API chưa cấu hình đúng, app sẽ fallback về trạng thái lỗi hoặc empty state rõ ràng.
- Có xử lý dọn các attribute do browser extension chèn vào DOM để giảm nhiễu trong dev hydration.

## Troubleshooting

- Gọi API thất bại: kiểm tra `NEXT_PUBLIC_API_BASE_URL`.
- Checkout không lên Stripe: kiểm tra `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
- Map không hiển thị: kiểm tra `NEXT_PUBLIC_GOONG_MAPS_TILES_KEY`.
- Warning hydration lẻ tẻ chỉ xuất hiện ở máy local: kiểm tra browser extension trước khi sửa code SSR.
