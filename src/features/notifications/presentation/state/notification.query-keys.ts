import type { NotificationListParams } from "@/features/notifications/domain/types/notification.types";

export const notificationKeys = {
  all: ["notifications"] as const,
  list: (params?: NotificationListParams) =>
    [...notificationKeys.all, "list", params] as const,
  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
};
