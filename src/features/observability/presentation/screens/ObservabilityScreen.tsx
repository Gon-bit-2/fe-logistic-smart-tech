"use client";

import { useMemo, useState } from "react";
import { Activity, AlertTriangle, Clock3, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/ui/data-states";
import {
  PageHeader,
  SectionCard,
  StatusBadge,
} from "@/features/admin/presentation/components/admin-primitives";
import {
  useAuditLogs,
  useFailedJobs,
  useObservabilityQueues,
  useSlowEndpoints,
} from "@/features/observability/presentation/hooks/useObservability";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/formatters";

type ObservabilityTab = "queues" | "failed" | "slow" | "audit";

function JsonPreview({ value }: Readonly<{ value: unknown }>) {
  return (
    <pre className="max-w-xl overflow-hidden text-ellipsis rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
      {JSON.stringify(value ?? {}, null, 2)}
    </pre>
  );
}

export default function ObservabilityScreen() {
  const [activeTab, setActiveTab] = useState<ObservabilityTab>("queues");
  const queuesQuery = useObservabilityQueues();
  const queueNames = queuesQuery.data?.data.map((queue) => queue.name) ?? [];
  const selectedFailedQueue = queueNames[0] ?? "notification";
  const failedJobsQuery = useFailedJobs(selectedFailedQueue);
  const slowEndpointsQuery = useSlowEndpoints();
  const auditLogsQuery = useAuditLogs();

  const tabs = useMemo(
    () =>
      [
        { icon: Activity, id: "queues" as const, label: "Queue health" },
        { icon: AlertTriangle, id: "failed" as const, label: "Failed jobs" },
        { icon: Clock3, id: "slow" as const, label: "Slow endpoints" },
        { icon: ListChecks, id: "audit" as const, label: "Audit logs" },
      ] satisfies { icon: typeof Activity; id: ObservabilityTab; label: string }[],
    [],
  );

  if (queuesQuery.isPending) {
    return (
      <LoadingState
        title="Đang tải observability"
        description="Đang đọc trạng thái queue và log vận hành."
      />
    );
  }

  if (queuesQuery.isError) {
    return (
      <ErrorState
        title="Không thể tải observability"
        description="Kiểm tra quyền admin hoặc kết nối backend."
        action={
          <Button variant="outline" onClick={() => void queuesQuery.refetch()}>
            Tải lại
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Production"
        title="Admin observability"
        description="Theo dõi queue, job lỗi, endpoint chậm và audit thay đổi trạng thái quan trọng."
      />

      <div className="flex flex-wrap gap-2 rounded-lg border border-slate-200 bg-white p-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition",
                activeTab === tab.id
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <Icon className="size-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "queues" ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {queuesQuery.data?.data.map((queue) => (
            <SectionCard key={queue.name} className="space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-slate-900">{queue.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">BullMQ queue</p>
                </div>
                <StatusBadge
                  label={queue.isPaused ? "Paused" : "Running"}
                  tone={queue.isPaused ? "amber" : "green"}
                />
              </div>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                {Object.entries(queue.counts).map(([key, value]) => (
                  <div key={key} className="rounded-lg bg-slate-50 p-3">
                    <dt className="text-xs font-bold uppercase text-slate-400">{key}</dt>
                    <dd className="mt-1 text-xl font-black text-slate-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </SectionCard>
          ))}
        </div>
      ) : null}

      {activeTab === "failed" ? (
        <SectionCard className="overflow-hidden p-0">
          {failedJobsQuery.data?.data.length ? (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">Job</th>
                  <th className="px-5 py-3">Reason</th>
                  <th className="px-5 py-3">Attempts</th>
                  <th className="px-5 py-3">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {failedJobsQuery.data.data.map((job) => (
                  <tr key={`${job.id}-${job.timestamp}`}>
                    <td className="px-5 py-4 font-semibold text-slate-900">{job.name}</td>
                    <td className="px-5 py-4 text-red-600">{job.failedReason ?? "-"}</td>
                    <td className="px-5 py-4 text-slate-600">{job.attemptsMade}</td>
                    <td className="px-5 py-4"><JsonPreview value={job.data} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState title="Không có failed jobs" description="Queue hiện không có job lỗi trong giới hạn đọc." />
          )}
        </SectionCard>
      ) : null}

      {activeTab === "slow" ? (
        <SectionCard className="overflow-hidden p-0">
          {slowEndpointsQuery.data?.data.length ? (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">Endpoint</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Duration</th>
                  <th className="px-5 py-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {slowEndpointsQuery.data.data.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-5 py-4 font-mono text-xs text-slate-700">{entry.method} {entry.path}</td>
                    <td className="px-5 py-4">{entry.statusCode}</td>
                    <td className="px-5 py-4 font-semibold text-amber-700">{entry.durationMs}ms</td>
                    <td className="px-5 py-4 text-slate-500">{formatDate(entry.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState title="Chưa có endpoint chậm" description="Log sẽ xuất hiện khi request vượt SLOW_REQUEST_MS." />
          )}
        </SectionCard>
      ) : null}

      {activeTab === "audit" ? (
        <SectionCard className="overflow-hidden p-0">
          {auditLogsQuery.data?.data.length ? (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">Action</th>
                  <th className="px-5 py-3">Entity</th>
                  <th className="px-5 py-3">Actor</th>
                  <th className="px-5 py-3">After</th>
                  <th className="px-5 py-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogsQuery.data.data.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-5 py-4 font-semibold text-slate-900">{entry.action}</td>
                    <td className="px-5 py-4 text-slate-600">{entry.entityType} #{entry.entityId}</td>
                    <td className="px-5 py-4 text-slate-600">{entry.actorUserId ?? "SYSTEM"}</td>
                    <td className="px-5 py-4"><JsonPreview value={entry.after} /></td>
                    <td className="px-5 py-4 text-slate-500">{formatDate(entry.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState title="Chưa có audit log" description="Log sẽ xuất hiện khi trạng thái đơn, chuyến, role hoặc COD thay đổi." />
          )}
        </SectionCard>
      ) : null}
    </div>
  );
}
