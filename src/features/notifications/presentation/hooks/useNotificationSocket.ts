"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { UserRole } from "@/features/auth/domain/types/auth.types";
import { getAuthSessionSnapshot } from "@/features/auth/presentation/state/auth.store";
import { mapNotificationApiToViewModel } from "@/features/notifications/application/mappers/notification.mapper";
import type {
  NotificationApiDto,
  NotificationViewModel,
} from "@/features/notifications/domain/types/notification.types";
import {
  acquireNotificationSocket,
  releaseNotificationSocket,
} from "@/features/notifications/presentation/lib/notification-socket.manager";
import { notificationKeys } from "@/features/notifications/presentation/state/notification.query-keys";
import { API_BASE_URL } from "@/lib/api/env";
import type { PaginatedResult } from "@/types/common.type";
import { API_NOTIFICATIONS_NAMESPACE } from "@/utils/apiUrl";

export function useNotificationSocket(role: UserRole, enabled = true) {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!enabled || !API_BASE_URL) return;

    const accessToken = getAuthSessionSnapshot().accessToken ?? undefined;
    if (!accessToken) return;

    const socketUrl = `${API_BASE_URL}${API_NOTIFICATIONS_NAMESPACE}`;
    const socket = acquireNotificationSocket({ authToken: accessToken, url: socketUrl });

    const handleNotificationCreated = (payload: NotificationApiDto) => {
      const viewModel = mapNotificationApiToViewModel(payload, role);
      queryClient.setQueriesData<PaginatedResult<NotificationViewModel>>(
        { queryKey: [...notificationKeys.all, "list"] },
        (current) => {
          if (!current) return current;
          if (current.data.some((notification) => notification.id === viewModel.id)) {
            return current;
          }

          return {
            ...current,
            data: [viewModel, ...current.data].slice(0, current.data.length || 20),
            totalItems: current.totalItems + 1,
          };
        },
      );
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
    };

    const handleUnreadCount = (payload: { totalUnread: number }) => {
      queryClient.setQueryData(notificationKeys.unreadCount(), payload);
    };

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    socket.on("notification.created", handleNotificationCreated);
    socket.on("notification.unread-count", handleUnreadCount);

    if (socket.connected) setIsConnected(true);

    return () => {
      socket.off("notification.created", handleNotificationCreated);
      socket.off("notification.unread-count", handleUnreadCount);
      releaseNotificationSocket({ authToken: accessToken, url: socketUrl });
      setIsConnected(false);
    };
  }, [enabled, queryClient, role]);

  return { isConnected };
}
