import type { PaginationParams } from "@/types/common.type";

export type NotificationPayload = {
  reviewedById?: number | null;
  roleRequestId?: number | null;
  status?: string | null;
  targetRoleName?: string | null;
  [key: string]: unknown;
};

export type NotificationApiDto = {
  content?: unknown;
  createdAt?: string | null;
  id: number | string;
  isRead?: boolean | null;
  message?: unknown;
  payload?: unknown;
  readAt?: string | null;
  title?: unknown;
  type?: string | null;
  updatedAt?: string | null;
};

export type NotificationListParams = PaginationParams & {
  isRead?: boolean;
};

export type UnreadCountResponse = {
  totalUnread: number;
};

export type NotificationViewModel = {
  content: string;
  createdAt: string;
  ctaHref: string | null;
  ctaLabel: string | null;
  id: string;
  isRead: boolean;
  payload: NotificationPayload;
  title: string;
};
