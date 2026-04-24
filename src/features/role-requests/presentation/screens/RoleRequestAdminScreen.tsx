"use client";

import { useState } from "react";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/ui/data-states";
import { Button } from "@/components/ui/button";
import { PageHeader, SectionCard, StatusBadge } from "@/features/admin/presentation/components/admin-primitives";
import { useHubsQuery } from "@/features/warehouses/presentation/hooks/useHubsQuery";
import {
  useAdminRoleRequestsQuery,
  useApproveRoleRequest,
  useRejectRoleRequest,
} from "@/features/role-requests/presentation/hooks/useRoleRequests";
import { useI18nCopy } from "@/i18n/useCopy";
import { ApiError } from "@/lib/api/errors";
import { formatDate } from "@/utils/formatters";
import type { RoleRequestStatus } from "@/features/role-requests/domain/types/role-request.types";
import { cn } from "@/lib/utils";
import type { RoleRequestViewModel } from "@/features/role-requests/domain/types/role-request.types";

const filterOptions: ReadonlyArray<RoleRequestStatus> = [
  "PENDING",
  "APPROVED",
  "REJECTED",
];
const EMPTY_ROLE_REQUESTS = [] as const;

function getStatusTone(status: RoleRequestStatus) {
  if (status === "APPROVED") {
    return "green" as const;
  }

  if (status === "REJECTED") {
    return "red" as const;
  }

  return "amber" as const;
}

type RoleRequestAdminCopy = ReturnType<typeof useI18nCopy>["roleRequestAdminCopy"];

function getAdminRoleRequestLoadErrorMessage(
  error: unknown,
  roleRequestAdminCopy: RoleRequestAdminCopy,
) {
  if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
    return error.message;
  }

  return roleRequestAdminCopy.loadErrorFallback;
}

export default function RoleRequestAdminScreen() {
  const { roleRequestAdminCopy } = useI18nCopy();
  const [status, setStatus] = useState<RoleRequestStatus>("PENDING");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const roleRequestsQuery = useAdminRoleRequestsQuery({
    limit: 20,
    page: 1,
    status,
  });
  const approveMutation = useApproveRoleRequest();
  const rejectMutation = useRejectRoleRequest();
  const hubsQuery = useHubsQuery();
  const requests = roleRequestsQuery.data?.data ?? EMPTY_ROLE_REQUESTS;
  const selectedRequest =
    requests.find((request) => request.id === selectedId) ?? requests[0] ?? null;

  if (roleRequestsQuery.isPending) {
    return (
      <LoadingState
        title="Đang tải queue role requests"
        description="Hệ thống đang gom các yêu cầu chờ duyệt mới nhất."
      />
    );
  }

  if (roleRequestsQuery.isError) {
    return (
      <ErrorState
        title="Không thể tải queue role requests"
        description={getAdminRoleRequestLoadErrorMessage(
          roleRequestsQuery.error,
          roleRequestAdminCopy,
        )}
      />
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin Review"
        title={roleRequestAdminCopy.title}
        description={roleRequestAdminCopy.description}
        actions={
          <div className="flex flex-wrap items-center gap-2 rounded-[1.15rem] bg-surface-container-low p-1.5">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setStatus(filter)}
                className={cn(
                  "rounded-[0.95rem] px-4 py-2 text-sm font-bold transition-colors",
                  status === filter
                    ? "bg-surface-container-lowest text-primary shadow-sm"
                    : "text-on-surface/55 hover:text-primary",
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        }
      />

      {requests.length === 0 ? (
        <EmptyState
          title={roleRequestAdminCopy.emptyTitle}
          description={roleRequestAdminCopy.emptyDescription}
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <SectionCard className="overflow-hidden">
            <div className="border-b border-outline-variant/10 px-6 py-5">
              <h2 className="text-2xl font-black tracking-tight text-on-surface">
                {roleRequestAdminCopy.queueTitle}
              </h2>
            </div>
            <div className="divide-y divide-outline-variant/10">
              {requests.map((request) => (
                <button
                  key={request.id}
                  type="button"
                  onClick={() => setSelectedId(request.id)}
                  className={cn(
                    "w-full px-6 py-5 text-left transition-colors",
                    selectedRequest?.id === request.id
                      ? "bg-primary-fixed/15"
                      : "hover:bg-surface-container-low/50",
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
                        {request.targetRoleLabel}
                      </p>
                      <h3 className="mt-2 text-lg font-bold text-on-surface">
                        {request.userDisplayName}
                      </h3>
                    </div>
                    <StatusBadge
                      label={request.status}
                      tone={getStatusTone(request.status)}
                    />
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-7 text-on-surface/60">
                    {request.reason}
                  </p>
                </button>
              ))}
            </div>
          </SectionCard>

          {selectedRequest ? (
            <RoleRequestReviewPanel
              key={selectedRequest.id}
              copy={roleRequestAdminCopy}
              request={selectedRequest}
              hubs={hubsQuery.data?.data ?? []}
              approveMutation={approveMutation}
              rejectMutation={rejectMutation}
            />
          ) : null}
        </div>
      )}
    </div>
  );
}

interface RoleRequestReviewPanelProps {
  readonly approveMutation: ReturnType<typeof useApproveRoleRequest>;
  readonly copy: RoleRequestAdminCopy;
  readonly hubs: ReadonlyArray<{ code: string; id: number | string; name: string }>;
  readonly rejectMutation: ReturnType<typeof useRejectRoleRequest>;
  readonly request: RoleRequestViewModel;
}

function RoleRequestReviewPanel({
  copy,
  request,
  hubs,
  approveMutation,
  rejectMutation,
}: Readonly<RoleRequestReviewPanelProps>) {
  const roleRequestAdminCopy = copy;
  const [reviewNote, setReviewNote] = useState(request.reviewNote ?? "");
  const [hubId, setHubId] = useState(request.hubId != null ? String(request.hubId) : "");
  const requireHub = request.targetRoleName === "WAREHOUSE_STAFF";

  async function handleApprove() {
    await approveMutation.mutateAsync({
      payload: {
        hubId: requireHub && hubId ? Number(hubId) : undefined,
        reviewNote: reviewNote.trim() || undefined,
      },
      requestId: request.id,
    });
  }

  async function handleReject() {
    await rejectMutation.mutateAsync({
      payload: {
        reviewNote: reviewNote.trim() || undefined,
      },
      requestId: request.id,
    });
  }

  return (
    <SectionCard className="p-6">
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
              {request.targetRoleLabel}
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-on-surface">
              {request.userDisplayName}
            </h2>
          </div>
          <StatusBadge
            label={request.status}
            tone={getStatusTone(request.status)}
          />
        </div>

        <div className="grid gap-4 rounded-[1.4rem] bg-surface-container-low/50 p-5 md:grid-cols-2">
          <p className="text-sm text-on-surface/65">
            Tạo lúc: {formatDate(request.createdAt)}
          </p>
          <p className="text-sm text-on-surface/65">
            Reviewer: {request.reviewerName ?? "Chưa có"}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-on-surface/45">
            Lý do
          </p>
          <p className="rounded-[1.4rem] border border-outline-variant/15 bg-surface-container-lowest px-5 py-4 text-sm leading-7 text-on-surface/70">
            {request.reason}
          </p>
        </div>

        {requireHub ? (
          <label className="block space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-on-surface/45">
              {roleRequestAdminCopy.hubLabel}
            </span>
            <select
              className="h-12 w-full rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              value={hubId}
              onChange={(event) => setHubId(event.target.value)}
            >
              <option value="">Chọn hub</option>
              {hubs.map((hub) => (
                <option key={hub.id} value={String(hub.id)}>
                  {hub.code} - {hub.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <label className="block space-y-2">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-on-surface/45">
            {roleRequestAdminCopy.reviewNoteLabel}
          </span>
          <textarea
            className="min-h-36 w-full rounded-2xl border border-outline-variant/20 bg-surface-container-lowest px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            value={reviewNote}
            onChange={(event) => setReviewNote(event.target.value)}
          />
        </label>

        {approveMutation.error || rejectMutation.error ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {approveMutation.error?.message ?? rejectMutation.error?.message}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => void handleApprove()}
            disabled={
              approveMutation.isPending ||
              rejectMutation.isPending ||
              (requireHub && !hubId)
            }
          >
            {roleRequestAdminCopy.approveButton}
          </Button>
          <Button
            variant="destructive"
            onClick={() => void handleReject()}
            disabled={approveMutation.isPending || rejectMutation.isPending}
          >
            {roleRequestAdminCopy.rejectButton}
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}
