"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserRole } from "@/features/auth/domain/types/auth.types";
import type {
  NotificationListParams,
  NotificationViewModel,
} from "@/features/notifications/domain/types/notification.types";
import {
  getUnreadNotificationsCountUseCase,
  listNotificationsUseCase,
  markAllNotificationsReadUseCase,
  markNotificationReadUseCase,
} from "@/features/notifications/application/use-cases/notification.use-cases";
import { notificationKeys } from "@/features/notifications/presentation/state/notification.query-keys";
import { ApiError } from "@/lib/api/errors";
import type { PaginatedResult } from "@/types/common.type";

export function useNotificationsQuery(role: UserRole, params?: NotificationListParams) {
  return useQuery<PaginatedResult<NotificationViewModel>, ApiError>({
    queryFn: () => listNotificationsUseCase(role, params),
    queryKey: notificationKeys.list(params),
  });
}

export function useUnreadNotificationsCount(enabled = true) {
  return useQuery<{ totalUnread: number }, ApiError>({
    enabled,
    queryFn: getUnreadNotificationsCountUseCase,
    queryKey: notificationKeys.unreadCount(),
    refetchInterval: 30_000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, ApiError, string>({
    mutationFn: markNotificationReadUseCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, ApiError, void>({
    mutationFn: markAllNotificationsReadUseCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
