import { httpClient } from "@/lib/api/http-client";
import {
  API_ADMIN_OBSERVABILITY_AUDIT_LOGS,
  API_ADMIN_OBSERVABILITY_FAILED_JOBS,
  API_ADMIN_OBSERVABILITY_QUEUES,
  API_ADMIN_OBSERVABILITY_SLOW_ENDPOINTS,
} from "@/utils/apiUrl";
import type {
  AuditLog,
  FailedJob,
  QueueSummary,
  SlowEndpoint,
} from "@/features/observability/domain/types/observability.types";
import type { PaginatedResult } from "@/types/common.type";

export async function getObservabilityQueuesRequest() {
  const response = await httpClient.get<{ data: QueueSummary[] }>(
    API_ADMIN_OBSERVABILITY_QUEUES,
  );
  return response.data;
}

export async function getFailedJobsRequest(queueName: string) {
  const response = await httpClient.get<{ data: FailedJob[] }>(
    API_ADMIN_OBSERVABILITY_FAILED_JOBS(queueName),
  );
  return response.data;
}

export async function getSlowEndpointsRequest() {
  const response = await httpClient.get<PaginatedResult<SlowEndpoint>>(
    API_ADMIN_OBSERVABILITY_SLOW_ENDPOINTS,
    { params: { limit: 25, page: 1 } },
  );
  return response.data;
}

export async function getAuditLogsRequest() {
  const response = await httpClient.get<PaginatedResult<AuditLog>>(
    API_ADMIN_OBSERVABILITY_AUDIT_LOGS,
    { params: { limit: 25, page: 1 } },
  );
  return response.data;
}
