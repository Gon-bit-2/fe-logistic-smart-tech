import { hasApiBaseUrl } from "@/lib/api/env";
import { ApiError } from "@/lib/api/errors";
import type { UserRole } from "@/features/auth/domain/types/auth.types";
import type { NotificationListParams } from "@/features/notifications/domain/types/notification.types";
import { mapNotificationApiToViewModel } from "@/features/notifications/application/mappers/notification.mapper";
import {
  getUnreadNotificationsCountRequest,
  listNotificationsRequest,
  markAllNotificationsReadRequest,
  markNotificationReadRequest,
} from "@/features/notifications/infrastructure/api/notification.api";

function assertApiConfigured() {
  if (!hasApiBaseUrl) {
    throw new ApiError({
      message: "Notifications API chưa được cấu hình.",
      status: 503,
    });
  }
}

export async function listNotificationsUseCase(
  role: UserRole,
  params?: NotificationListParams,
) {
  assertApiConfigured();
  const response = await listNotificationsRequest(params);

  return {
    data: response.data.map((notification) =>
      mapNotificationApiToViewModel(notification, role),
    ),
    totalItems: response.totalItems,
  };
}

export async function getUnreadNotificationsCountUseCase() {
  assertApiConfigured();
  return getUnreadNotificationsCountRequest();
}

export async function markNotificationReadUseCase(notificationId: string) {
  assertApiConfigured();
  return markNotificationReadRequest(notificationId);
}

export async function markAllNotificationsReadUseCase() {
  assertApiConfigured();
  return markAllNotificationsReadRequest();
}
