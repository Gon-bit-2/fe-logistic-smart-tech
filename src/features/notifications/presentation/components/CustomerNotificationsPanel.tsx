"use client";

import { Link } from "@/i18n/routing";
import { BellDot, BellRing, CheckCheck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthSession } from "@/features/auth/presentation/hooks/useAuthSession";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotificationsQuery,
} from "@/features/notifications/presentation/hooks/useNotifications";
import { useI18nCopy } from "@/i18n/useCopy";
import { ApiError } from "@/lib/api/errors";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/formatters";

type NotificationScreenCopy = ReturnType<typeof useI18nCopy>["notificationScreenCopy"];

function getNotificationLoadErrorMessage(
  error: unknown,
  notificationScreenCopy: NotificationScreenCopy,
) {
  if (error instanceof ApiError) {
    if (error.status === 401) return notificationScreenCopy.loadErrorUnauthorized;
    if (error.status === 403) return notificationScreenCopy.loadErrorForbidden;
  }

  return notificationScreenCopy.loadErrorFallback;
}

type CustomerNotificationsPanelProps = Readonly<{
  enabled?: boolean;
}>;

export default function CustomerNotificationsPanel({
  enabled = true,
}: CustomerNotificationsPanelProps) {
  const { notificationScreenCopy } = useI18nCopy();
  const { user } = useAuthSession();
  const role = user?.role ?? "customer";
  const notificationsQuery = useNotificationsQuery(
    role,
    {
      limit: 8,
      page: 1,
    },
    enabled,
  );
  const markReadMutation = useMarkNotificationRead();
  const markAllMutation = useMarkAllNotificationsRead();

  const notifications = notificationsQuery.data?.data ?? [];
  const hasUnread = notifications.some((notification) => !notification.isRead);

  return (
    <section className="w-[min(92vw,26rem)] overflow-hidden rounded-[1.5rem] border border-emerald-100 bg-white shadow-[0_28px_70px_-28px_rgba(6,78,59,0.45)]">
      <div className="border-b border-emerald-100 bg-[linear-gradient(180deg,rgba(236,253,245,0.95),rgba(255,255,255,0.95))] px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-emerald-600">
              Inbox
            </p>
            <h2 className="mt-1 text-lg font-black tracking-tight text-emerald-950">
              Thông báo
            </h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Cập nhật duyệt role, nhắc việc và trạng thái hệ thống.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!hasUnread || markAllMutation.isPending}
            className="rounded-full border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50"
            onClick={() => void markAllMutation.mutateAsync()}
          >
            <CheckCheck className="size-4" />
            Đọc hết
          </Button>
        </div>
      </div>

      <div className="max-h-[26rem] overflow-y-auto p-3">
        {notificationsQuery.isPending ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-6 text-sm text-slate-500">
            Đang tải inbox thông báo...
          </div>
        ) : notificationsQuery.isError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50/80 px-4 py-6 text-sm text-red-700">
            {getNotificationLoadErrorMessage(
              notificationsQuery.error,
              notificationScreenCopy,
            )}
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 text-center">
            <p className="text-sm font-semibold text-slate-700">
              {notificationScreenCopy.emptyTitle}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              {notificationScreenCopy.emptyDescription}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <article
                key={notification.id}
                className={cn(
                  "rounded-2xl border p-4 transition-colors",
                  notification.isRead
                    ? "border-slate-200 bg-slate-50/60"
                    : "border-emerald-200 bg-emerald-50/70",
                )}
              >
                <div className="flex gap-3">
                  <div
                    className={cn(
                      "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-2xl",
                      notification.isRead
                        ? "bg-white text-slate-400"
                        : "bg-white text-emerald-600",
                    )}
                  >
                    {notification.isRead ? (
                      <BellDot className="size-5" />
                    ) : (
                      <BellRing className="size-5" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-bold text-slate-900">
                        {notification.title}
                      </h3>
                      {!notification.isRead ? (
                        <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.14em] text-white">
                          Mới
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-1 text-sm leading-5 text-slate-600">
                      {notification.content}
                    </p>
                    <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                      {formatDate(notification.createdAt)}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {!notification.isRead ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="rounded-full px-3 text-slate-600 hover:bg-white hover:text-slate-900"
                          disabled={markReadMutation.isPending}
                          onClick={() => void markReadMutation.mutateAsync(notification.id)}
                        >
                          {notificationScreenCopy.markOne}
                        </Button>
                      ) : null}

                      {notification.ctaHref && notification.ctaLabel ? (
                        <Button
                          asChild
                          size="sm"
                          className="rounded-full bg-emerald-600 px-3 text-white hover:bg-emerald-700"
                        >
                          <Link href={notification.ctaHref}>
                            {notification.ctaLabel}
                            <ChevronRight className="size-4" />
                          </Link>
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
