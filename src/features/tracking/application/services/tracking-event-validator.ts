import type { TrackingEventCreateInput } from "@/features/tracking/domain/types/tracking.types";
import { ApiError } from "@/lib/api/errors";

const TRACKING_EVENT_SOURCES = new Set([
  "DRIVER_APP",
  "HUB_SCANNER",
  "SYSTEM",
  "ADMIN_PORTAL",
  "CUSTOMER_APP",
] as const);

const TRACKING_PACKAGE_CONDITIONS = new Set([
  "INTACT",
  "DAMAGED",
  "PARTIAL",
] as const);

export function validateTrackingEventInput(input: TrackingEventCreateInput) {
  if (!TRACKING_EVENT_SOURCES.has(input.source)) {
    throw new ApiError({
      message: "Nguồn cập nhật hành trình không hợp lệ.",
      status: 422,
    });
  }

  if (input.eventType === "STATUS_CHANGE" && !input.status) {
    throw new ApiError({
      message: "Lượt cập nhật đổi trạng thái phải có `status`.",
      status: 422,
    });
  }

  if (input.eventType === "EXCEPTION" && !input.failureReasonCode) {
    throw new ApiError({
      message: "Lượt cập nhật sự cố phải có `failureReasonCode`.",
      status: 422,
    });
  }

  if (input.status === "DELIVERED" && !input.pod) {
    throw new ApiError({
      message: "Trạng thái giao thành công phải có dữ liệu biên nhận.",
      status: 422,
    });
  }

  if (input.status === "DELIVERED" && input.pod) {
    if (
      input.pod.packageCondition &&
      !TRACKING_PACKAGE_CONDITIONS.has(input.pod.packageCondition)
    ) {
      throw new ApiError({
        message: "Tình trạng kiện hàng không hợp lệ.",
        status: 422,
      });
    }

    if (!input.pod.receiverName?.trim()) {
      throw new ApiError({
        message: "Phải nhập tên người nhận khi xác nhận giao thành công.",
        status: 422,
      });
    }

    if (!input.pod.images?.length) {
      throw new ApiError({
        message: "Phải tải lên ít nhất 1 ảnh biên nhận khi xác nhận giao thành công.",
        status: 422,
      });
    }
  }
}
