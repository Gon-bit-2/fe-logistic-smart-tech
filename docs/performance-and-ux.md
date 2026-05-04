# Frontend performance và UX lỗi

## React Query

- Query mặc định stale `60s`, gc `5m`.
- Analytics dùng stale `5m` vì dữ liệu không cần realtime từng giây.
- Notifications và tracking giữ refresh/socket riêng vì người dùng cần phản hồi nhanh.
- Mutation chỉ invalidate query cụ thể. Tránh invalidate cả domain nếu chỉ thay đổi list/detail hẹp.

## API error

`normalizeApiError` chuẩn hóa mọi lỗi thành `ApiError`:

- `status`: HTTP status.
- `message`: thông điệp có thể hiển thị.
- `errorCode`: machine code từ backend, ví dụ `Error.PermissionDenied.NotYourHub`.
- `requestId`: mã đối chiếu log backend.
- `issues`: validation issue nếu có.

Màn hình nên hiển thị message ngắn, nút retry khi action có thể thử lại, và request id trong các lỗi hệ thống nếu cần gửi đội kỹ thuật.

## Realtime UX

- Tracking socket dùng shared socket store để tránh mở nhiều connection cùng token.
- Dashboard hiển thị cảnh báo khi có active trip nhưng WebSocket chưa kết nối.
- Khi socket mất kết nối, không spam dialog/toast; giữ dữ liệu gần nhất và tự đồng bộ khi socket quay lại.

## Checklist màn nặng

1. Memo hóa list/filter/sort lớn bằng `useMemo`.
2. Không render map khi thiếu API key hoặc không có dữ liệu tọa độ.
3. Không gọi query khi input rỗng; dùng `enabled`.
4. Với form quote/autocomplete, giữ debounce và cache ngắn.
5. Dùng `ErrorState`, `EmptyState`, `LoadingState` thay cho `alert`.
