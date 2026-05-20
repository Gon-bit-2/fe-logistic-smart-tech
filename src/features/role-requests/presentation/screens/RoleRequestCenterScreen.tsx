"use client";

import { type FormEvent, useMemo, useState } from "react";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/ui/data-states";
import { Button } from "@/components/ui/button";
import { PageHeader, SectionCard, StatusBadge } from "@/features/admin/presentation/components/admin-primitives";
import { useAuthSession } from "@/features/auth/presentation/hooks/useAuthSession";
import {
  useCreateRoleRequest,
  useMyRoleRequestsQuery,
} from "@/features/role-requests/presentation/hooks/useRoleRequests";
import { useHubsQuery } from "@/features/warehouses/presentation/hooks/useHubsQuery";
import { useTranslations } from "next-intl";
import { ApiError } from "@/lib/api/errors";
import { formatDate } from "@/utils/formatters";
import type { TargetRoleName } from "@/features/role-requests/domain/types/role-request.types";
import { ArrowRight, UserPlus, FileText, CheckCircle2, History, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const EMPTY_ROLE_REQUESTS = [] as const;

function getRoleLabel(role?: string | null) {
  switch (role) {
    case "admin":
      return "Quản trị viên";
    case "customer":
      return "Khách hàng";
    case "driver":
    case "DRIVER":
      return "Tài xế";
    case "warehouse_staff":
    case "WAREHOUSE_STAFF":
      return "Nhân viên kho";
    default:
      return "Chưa xác định";
  }
}

function getRequestStatusLabel(status: string) {
  switch (status) {
    case "APPROVED":
      return "Đã duyệt";
    case "REJECTED":
      return "Đã từ chối";
    case "PENDING":
      return "Chờ duyệt";
    default:
      return status;
  }
}

function mapUserRoleToTarget(role?: string | null): TargetRoleName | null {
  if (role === "driver") return "DRIVER";
  if (role === "warehouse_staff") return "WAREHOUSE_STAFF";
  return null;
}

function getStatusTone(status: string) {
  if (status === "APPROVED") return "green" as const;
  if (status === "REJECTED") return "red" as const;
  return "amber" as const;
}

function getRoleRequestLoadErrorMessage(
  error: unknown,
  t: ReturnType<typeof useTranslations<"roleRequests">>,
) {
  if (error instanceof ApiError) {
    if (error.status === 401) return t("center.loadErrorUnauthorized");
    if (error.status === 403) return t("center.loadErrorForbidden");
  }
  return t("center.loadErrorFallback");
}

export default function RoleRequestCenterScreen() {
  const t = useTranslations("roleRequests");
  const { user } = useAuthSession();
  const roleRequestsQuery = useMyRoleRequestsQuery({ limit: 10, page: 1 });
  const createRoleRequestMutation = useCreateRoleRequest();
  const hubsQuery = useHubsQuery();
  
  const [targetRoleName, setTargetRoleName] = useState<TargetRoleName>("DRIVER");
  const [hubId, setHubId] = useState("");
  const [reason, setReason] = useState("");
  
  const requests = roleRequestsQuery.data?.data ?? EMPTY_ROLE_REQUESTS;
  const hasPendingRequest = requests.some((request) => request.status === "PENDING");
  const currentTargetRole = mapUserRoleToTarget(user?.role);
  
  const hasApprovedNewRole = useMemo(
    () =>
      requests.some(
        (request) =>
          request.status === "APPROVED" && request.targetRoleName !== currentTargetRole,
      ),
    [currentTargetRole, requests],
  );
  
  const canSubmit = user?.role != null && user.role !== "admin" && !hasPendingRequest;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || reason.trim().length === 0 || !hubId) return;

    await createRoleRequestMutation.mutateAsync({
      hubId: Number(hubId),
      reason: reason.trim(),
      targetRoleName,
    });
    setReason("");
    setHubId("");
  }

  if (roleRequestsQuery.isPending) {
    return (
      <LoadingState
        title="Đang tải yêu cầu vai trò"
        description="Hệ thống đang đồng bộ lịch sử yêu cầu mới nhất."
      />
    );
  }

  if (roleRequestsQuery.isError) {
    return (
      <ErrorState
        title="Không thể tải yêu cầu vai trò"
        description={getRoleRequestLoadErrorMessage(
          roleRequestsQuery.error,
          t,
        )}
      />
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        eyebrow="Phân quyền"
        title={t("center.title")}
        description={t("center.description")}
      />

      {hasPendingRequest && (
        <div className="flex items-center gap-4 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-white px-6 py-5 text-amber-800 shadow-sm">
          <AlertCircle className="size-6 text-amber-500 shrink-0" />
          <div>
            <h3 className="font-bold text-amber-900">Yêu cầu đang chờ duyệt</h3>
            <p className="text-sm mt-1">{t("center.pendingBanner")}</p>
          </div>
        </div>
      )}

      {hasApprovedNewRole && (
        <div className="flex items-center gap-4 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 to-white px-6 py-5 text-primary shadow-sm">
          <CheckCircle2 className="size-6 text-primary shrink-0" />
          <div>
            <h3 className="font-bold text-primary-900">Yêu cầu đã được phê duyệt</h3>
            <p className="text-sm mt-1 text-primary/80">{t("center.refreshRoleBanner")}</p>
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <SectionCard className="p-8 border-t-4 border-t-primary relative overflow-hidden group">
          {/* Decorative background element */}
          <div className="absolute -right-20 -top-20 size-64 rounded-full bg-primary/5 blur-3xl transition-transform duration-700 group-hover:scale-150" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <UserPlus className="size-6" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                  {t("center.currentRoleLabel")}
                </p>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 mt-1">
                  {getRoleLabel(user?.role)}
                </h2>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  Vị trí ứng tuyển
                </label>
                <div className="relative">
                  <select
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm font-medium text-slate-900 transition-all hover:bg-slate-50 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                    value={targetRoleName}
                    onChange={(e) => setTargetRoleName(e.target.value as TargetRoleName)}
                    disabled={!canSubmit || createRoleRequestMutation.isPending}
                  >
                    <option value="DRIVER">Tài xế giao hàng</option>
                    <option value="WAREHOUSE_STAFF">Nhân viên kho</option>
                  </select>
                  <ArrowRight className="absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  Trung tâm mong muốn
                </label>
                <select
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm font-medium text-slate-900 transition-all hover:bg-slate-50 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                  value={hubId}
                  onChange={(event) => setHubId(event.target.value)}
                  disabled={!canSubmit || createRoleRequestMutation.isPending}
                >
                  <option value="">
                    {hubsQuery.isPending ? "Đang tải trung tâm..." : "Chọn trung tâm bạn muốn đăng ký"}
                  </option>
                  {(hubsQuery.data?.data ?? []).map((hub) => (
                    <option key={hub.id} value={String(hub.id)}>
                      {hub.code} - {hub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <FileText className="size-4 text-primary" />
                  {t("center.reasonLabel")}
                </label>
                <textarea
                  className="min-h-[140px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm text-slate-900 transition-all placeholder:text-slate-400 hover:bg-slate-50 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  disabled={!canSubmit || createRoleRequestMutation.isPending}
                  placeholder="Vui lòng mô tả chi tiết kinh nghiệm làm việc hoặc lý do bạn muốn ứng tuyển vào vị trí này..."
                />
              </div>

              {createRoleRequestMutation.error && (
                <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                  {createRoleRequestMutation.error.message}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 group"
                disabled={!canSubmit || createRoleRequestMutation.isPending || reason.trim().length === 0 || !hubId}
              >
                {t("center.submitLabel")}
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>
          </div>
        </SectionCard>

        <SectionCard className="flex flex-col overflow-hidden bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 px-8 py-6 bg-white">
            <div className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <History className="size-5" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-slate-900">
              {t("center.historyTitle")}
            </h2>
          </div>

          <div className="flex-1 bg-slate-50/30">
            {requests.length === 0 ? (
              <div className="flex h-full items-center justify-center p-8">
                <EmptyState
                  title="Chưa có yêu cầu nào"
                  description="Lịch sử ứng tuyển của bạn sẽ hiển thị tại đây."
                />
              </div>
            ) : (
              <div className="divide-y divide-slate-100 p-4">
                {requests.map((request) => (
                  <article 
                    key={request.id} 
                    className="group relative rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:shadow-md hover:ring-primary/20 mb-4 last:mb-0"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 items-center justify-center rounded-lg bg-primary/10 px-3 text-xs font-black uppercase tracking-wider text-primary">
                            {getRoleLabel(request.targetRoleName)}
                          </span>
                          <span className="text-xs font-semibold text-slate-400">
                            {formatDate(request.createdAt)}
                          </span>
                        </div>
                      </div>
                      <StatusBadge
                        label={getRequestStatusLabel(request.status)}
                        tone={getStatusTone(request.status)}
                      />
                    </div>
                    
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-sm leading-relaxed text-slate-700">
                        <span className="font-semibold text-slate-900 mr-2">Lý do:</span>
                        {request.reason}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-slate-50 pt-4 text-xs font-medium text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-slate-300" />
                        Người duyệt: <span className="text-slate-900">{request.reviewerName ?? "Chờ xét duyệt"}</span>
                      </div>
                      {request.reviewNote && (
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <span className="size-1.5 rounded-full bg-primary/40" />
                          Phản hồi: <span className="italic">{request.reviewNote}</span>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
