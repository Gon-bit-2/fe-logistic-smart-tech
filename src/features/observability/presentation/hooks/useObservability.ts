"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getAuditLogsRequest,
  getFailedJobsRequest,
  getObservabilityQueuesRequest,
  getSlowEndpointsRequest,
} from "@/features/observability/infrastructure/api/observability.api";

export const observabilityKeys = {
  all: ["observability"] as const,
  auditLogs: () => [...observabilityKeys.all, "audit-logs"] as const,
  failedJobs: (queueName: string) =>
    [...observabilityKeys.all, "failed-jobs", queueName] as const,
  queues: () => [...observabilityKeys.all, "queues"] as const,
  slowEndpoints: () => [...observabilityKeys.all, "slow-endpoints"] as const,
};

export function useObservabilityQueues() {
  return useQuery({
    queryFn: getObservabilityQueuesRequest,
    queryKey: observabilityKeys.queues(),
    refetchInterval: 15_000,
  });
}

export function useFailedJobs(queueName: string) {
  return useQuery({
    enabled: Boolean(queueName),
    queryFn: () => getFailedJobsRequest(queueName),
    queryKey: observabilityKeys.failedJobs(queueName),
  });
}

export function useSlowEndpoints() {
  return useQuery({
    queryFn: getSlowEndpointsRequest,
    queryKey: observabilityKeys.slowEndpoints(),
    refetchInterval: 30_000,
  });
}

export function useAuditLogs() {
  return useQuery({
    queryFn: getAuditLogsRequest,
    queryKey: observabilityKeys.auditLogs(),
    refetchInterval: 30_000,
  });
}
