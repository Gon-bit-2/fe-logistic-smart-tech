import {
  type NotificationApiDto,
  type NotificationPayload,
  type NotificationViewModel,
} from "@/features/notifications/domain/types/notification.types";
import type { UserRole } from "@/features/auth/domain/types/auth.types";
import {
  getNotificationsHrefForRole,
  getRoleRequestHrefForRole,
} from "@/features/auth/application/services/auth-session";
import { formatEnumLabel } from "@/utils/formatters";

function toPayload(payload?: unknown): NotificationPayload {
  return payload && typeof payload === "object" && !Array.isArray(payload)
    ? (payload as NotificationPayload)
    : {};
}

function normalizeMessageValue(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => normalizeMessageValue(item))
      .filter(Boolean)
      .join(", ");
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    if ("message" in record) {
      return normalizeMessageValue(record.message);
    }

    return JSON.stringify(record);
  }

  return "";
}

function getFallbackTitle(payload: NotificationPayload) {
  if (payload.assignmentRequestId != null) {
    return "Cập nhật yêu cầu nhận đơn";
  }

  if (payload.roleRequestId != null) {
    return "Cập nhật yêu cầu vai trò";
  }

  return "Thông báo hệ thống";
}

function getFallbackContent(payload: NotificationPayload) {
  if (payload.assignmentRequestId != null) {
    const orderTrackingCode = payload.orderTrackingCode ?? `ORD-${payload.orderId ?? "N/A"}`;
    const status = payload.status ? formatEnumLabel(payload.status) : "đã được cập nhật";

    return `Yêu cầu nhận đơn ${orderTrackingCode} của bạn đang ở trạng thái ${status}.`;
  }

  if (payload.roleRequestId == null) {
    return "Bạn có một thông báo mới trong hệ thống.";
  }

  const targetRole = payload.targetRoleName
    ? formatEnumLabel(payload.targetRoleName)
    : "vai trò mới";
  const status = payload.status ? formatEnumLabel(payload.status) : "đã được cập nhật";

  return `Yêu cầu chuyển sang ${targetRole} đang ở trạng thái ${status}.`;
}

function getRoleRequestCta(role: UserRole, payload: NotificationPayload) {
  if (payload.assignmentRequestId != null) {
    if (role === "warehouse_staff") {
      return {
        ctaHref: "/warehouse/trips",
        ctaLabel: "Mở queue điều phối",
      };
    }

    if (role === "driver") {
      return {
        ctaHref: "/driver",
        ctaLabel: "Mở dashboard tài xế",
      };
    }
  }

  if (payload.roleRequestId == null) {
    return {
      ctaHref: getNotificationsHrefForRole(role),
      ctaLabel: null,
    };
  }

  return {
    ctaHref: role === "admin" ? "/admin/role-requests" : getRoleRequestHrefForRole(role),
    ctaLabel: role === "admin" ? "Mở queue duyệt" : "Mở trung tâm role",
  };
}

export function mapNotificationApiToViewModel(
  notification: NotificationApiDto,
  role: UserRole,
): NotificationViewModel {
  const payload = toPayload(notification.payload);
  const title =
    normalizeMessageValue(notification.title) ||
    normalizeMessageValue(notification.message) ||
    getFallbackTitle(payload);
  const content =
    normalizeMessageValue(notification.content) ||
    normalizeMessageValue(notification.message) ||
    getFallbackContent(payload);
  const { ctaHref, ctaLabel } = getRoleRequestCta(role, payload);

  return {
    content,
    createdAt: notification.createdAt ?? notification.updatedAt ?? new Date().toISOString(),
    ctaHref,
    ctaLabel,
    id: String(notification.id),
    isRead: Boolean(notification.isRead),
    payload,
    title,
  };
}
