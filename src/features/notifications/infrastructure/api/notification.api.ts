import type { PaginatedResult } from "@/types/common.type";
import { httpClient } from "@/lib/api/http-client";
import type {
  NotificationApiDto,
  NotificationListParams,
  UnreadCountResponse,
} from "@/features/notifications/domain/types/notification.types";
import {
  API_NOTIFICATIONS,
  API_NOTIFICATIONS_MARK_ALL_READ,
  API_NOTIFICATIONS_MARK_READ,
  API_NOTIFICATIONS_UNREAD_COUNT,
} from "@/utils/apiUrl";

export async function listNotificationsRequest(params?: NotificationListParams) {
  const response = await httpClient.get<PaginatedResult<NotificationApiDto>>(
    API_NOTIFICATIONS,
    { params },
  );

  return response.data;
}

export async function getUnreadNotificationsCountRequest() {
  const response = await httpClient.get<UnreadCountResponse>(
    API_NOTIFICATIONS_UNREAD_COUNT,
  );
  return response.data;
}

export async function markNotificationReadRequest(notificationId: string) {
  const response = await httpClient.patch<{ message: string }>(
    API_NOTIFICATIONS_MARK_READ(notificationId),
  );
  return response.data;
}

export async function markAllNotificationsReadRequest() {
  const response = await httpClient.patch<{ message: string }>(
    API_NOTIFICATIONS_MARK_ALL_READ,
  );
  return response.data;
}
