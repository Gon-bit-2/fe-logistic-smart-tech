# Frontend onboarding

## Chạy local

```bash
npm install
npm run dev
```

Ứng dụng mặc định chạy ở `http://localhost:3000`.

## Test và build

```bash
npm run test:unit
npm run build
npm run test:e2e:mock
```

## Cấu trúc cần nắm

- `src/app`: Next.js App Router, layout, error boundary, route handler.
- `src/features`: code theo domain nghiệp vụ.
- `src/lib/api`: HTTP client, env, error normalization.
- `src/lib/query-client.ts`: cấu hình React Query.
- `src/components/ui`: UI primitive và reusable state.
- `src/i18n`: copy, routing, locale config.

## Quy tắc code

- Component màn hình đọc dữ liệu qua hook/use-case, không gọi API trực tiếp nếu domain đã có infrastructure layer.
- Mapper xử lý khác biệt backend DTO; component chỉ nhận view model.
- Dùng `ErrorState`, `EmptyState`, `LoadingState` cho trạng thái dữ liệu.
- Với mutation, invalidate query hẹp nhất có thể.
- Với realtime, không mở socket mới nếu shared manager đã đáp ứng.

## Checklist debug

- API lỗi: kiểm tra `NEXT_PUBLIC_API_BASE_URL`, response `requestId`, backend log.
- Auth lỗi: kiểm tra refresh token route và local auth store.
- Map không hiển thị: kiểm tra Goong key và dữ liệu lat/lng.
- Stripe không render: kiểm tra publishable key và payment record.
- Dashboard stale: kiểm tra query invalidation và socket connection state.
