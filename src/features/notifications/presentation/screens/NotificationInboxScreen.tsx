"use client";

import { Link } from "@/i18n/routing";
import { useMemo, useState } from "react";
import { BellDot, BellRing, ArrowRight, CheckCheck } from "lucide-react";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/ui/data-states";
import { Button } from "@/components/ui/button";
import { PageHeader, SectionCard } from "@/features/admin/presentation/components/admin-primitives";
import { useAuthSession } from "@/features/auth/presentation/hooks/useAuthSession";
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotificationsQuery } from "@/features/notifications/presentation/hooks/useNotifications";
import { useNotificationSocket } from "@/features/notifications/presentation/hooks/useNotificationSocket";
import { useTranslations } from "next-intl";
import { ApiError } from "@/lib/api/errors";
import { formatDate } from "@/utils/formatters";
import { cn } from "@/lib/utils";

function getNotificationLoadErrorMessage(
  error: unknown,
  t: ReturnType<typeof useTranslations<"notifications">>,
) {
  if (error instanceof ApiError) {
    if (error.status === 401) return t("loadErrorUnauthorized");
    if (error.status === 403) return t("loadErrorForbidden");
  }
  return t("loadErrorFallback");
}

export default function NotificationInboxScreen() {
  const t = useTranslations("notifications");
  const { user } = useAuthSession();
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  
  const role = user?.role ?? "customer";
  const params = useMemo(
    () => ({
      isRead: showUnreadOnly ? false : undefined,
      limit: 20,
      page: 1,
    }),
    [showUnreadOnly],
  );
  
  const notificationsQuery = useNotificationsQuery(role, params);
  useNotificationSocket(role);
  const markReadMutation = useMarkNotificationRead();
  const markAllMutation = useMarkAllNotificationsRead();
  
  const notifications = notificationsQuery.data?.data ?? [];
  const hasUnread = notifications.some((notification) => !notification.isRead);

  if (notificationsQuery.isPending) {
    return (
      <LoadingState
        title="Đang tải inbox thông báo"
        description="Hệ thống đang đồng bộ trạng thái mới nhất."
      />
    );
  }

  if (notificationsQuery.isError) {
    return (
      <ErrorState
        title="Không thể tải notifications"
        description={getNotificationLoadErrorMessage(
          notificationsQuery.error,
          t,
        )}
        action={
          <Button variant="outline" onClick={() => void notificationsQuery.refetch()}>
            Tải lại
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        eyebrow="Inbox"
        title={t("title")}
        description={t("description")}
        actions={
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-2xl bg-slate-100/80 p-1.5 shadow-inner">
              <button
                type="button"
                onClick={() => setShowUnreadOnly(false)}
                className={cn(
                  "rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-300",
                  !showUnreadOnly
                    ? "bg-white text-primary shadow-sm ring-1 ring-slate-900/5"
                    : "text-slate-500 hover:text-slate-900",
                )}
              >
                {t("allTab")}
              </button>
              <button
                type="button"
                onClick={() => setShowUnreadOnly(true)}
                className={cn(
                  "rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-300",
                  showUnreadOnly
                    ? "bg-white text-primary shadow-sm ring-1 ring-slate-900/5"
                    : "text-slate-500 hover:text-slate-900",
                )}
              >
                {t("unreadTab")}
                {hasUnread && (
                  <span className="ml-2 inline-flex size-2 rounded-full bg-red-500" />
                )}
              </button>
            </div>
            
            <Button
              variant="outline"
              className={cn(
                "h-12 rounded-2xl border-slate-200 bg-white font-bold transition-all hover:bg-slate-50 hover:text-primary",
                !hasUnread && "opacity-50"
              )}
              disabled={!hasUnread || markAllMutation.isPending}
              onClick={() => void markAllMutation.mutateAsync()}
            >
              <CheckCheck className="mr-2 size-4" />
              {t("markAll")}
            </Button>
          </div>
        }
      />

      {notifications.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/50">
          <EmptyState
            title={t("emptyTitle")}
            description={t("emptyDescription")}
          />
        </div>
      ) : (
        <div className="grid gap-4">
          {notifications.map((notification) => (
            <SectionCard
              key={notification.id}
              className={cn(
                "group relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg",
                notification.isRead
                  ? "bg-white opacity-80 hover:opacity-100"
                  : "bg-gradient-to-r from-primary/5 to-white ring-1 ring-primary/20",
              )}
            >
              {!notification.isRead && (
                <div className="absolute left-0 top-0 h-full w-1 bg-primary" />
              )}
              
              <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start lg:p-8">
                <div className="flex min-w-0 flex-1 gap-5">
                  <div
                    className={cn(
                      "mt-1 flex size-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3",
                      notification.isRead
                        ? "bg-slate-100 text-slate-400"
                        : "bg-primary/10 text-primary shadow-inner",
                    )}
                  >
                    {notification.isRead ? (
                      <BellDot className="size-6" />
                    ) : (
                      <BellRing className="size-6 animate-pulse" />
                    )}
                  </div>
                  
                  <div className="min-w-0 space-y-2.5">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className={cn(
                        "text-lg font-black tracking-tight",
                        notification.isRead ? "text-slate-700" : "text-slate-900"
                      )}>
                        {notification.title}
                      </h2>
                      {!notification.isRead && (
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-primary ring-1 ring-inset ring-primary/20">
                          Mới
                        </span>
                      )}
                    </div>
                    
                    <p className={cn(
                      "max-w-3xl text-sm leading-relaxed",
                      notification.isRead ? "text-slate-500" : "text-slate-700 font-medium"
                    )}>
                      {notification.content}
                    </p>
                    
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3 self-start sm:self-center">
                  {notification.ctaHref && notification.ctaLabel && (
                    <Button 
                      asChild 
                      className={cn(
                        "rounded-xl font-bold transition-all",
                        notification.isRead 
                          ? "bg-slate-100 text-slate-700 hover:bg-slate-200" 
                          : "bg-primary text-white shadow-md hover:bg-primary/90 hover:shadow-lg"
                      )}
                    >
                      <Link href={notification.ctaHref}>
                        {notification.ctaLabel}
                        <ArrowRight className="ml-2 size-4" />
                      </Link>
                    </Button>
                  )}
                  
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      className="rounded-xl font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      disabled={markReadMutation.isPending}
                      onClick={() => void markReadMutation.mutateAsync(notification.id)}
                    >
                      {t("markOne")}
                    </Button>
                  )}
                </div>
              </div>
            </SectionCard>
          ))}
        </div>
      )}
    </div>
  );
}
