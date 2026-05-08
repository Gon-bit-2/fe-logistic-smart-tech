export type QueueSummary = {
  counts: Record<string, number>;
  isPaused: boolean;
  name: string;
};

export type FailedJob = {
  attemptsMade: number;
  data: unknown;
  failedReason?: string | null;
  finishedOn?: string | null;
  id?: string | number;
  name: string;
  stacktrace: string[];
  timestamp: string;
};

export type SlowEndpoint = {
  createdAt: string;
  durationMs: number;
  id: number;
  method: string;
  path: string;
  requestId?: string | null;
  statusCode: number;
  userAgent?: string | null;
  userId?: number | null;
};

export type AuditLog = {
  action: string;
  actorUserId?: number | null;
  after?: unknown;
  before?: unknown;
  createdAt: string;
  entityId: string;
  entityType: string;
  id: number;
  metadata?: unknown;
};
