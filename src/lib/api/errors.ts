import axios from "axios";
import type { ApiErrorStatus, ValidationIssue } from "@/types/common.type";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getStatusFallbackMessage(status: number | null) {
  if (status === 401) {
    return "Your session has expired. Please log in again.";
  }

  if (status === 403) {
    return "You do not have permission to perform this action.";
  }

  if (status === 404) {
    return "The requested resource was not found.";
  }

  return "";
}

function looksLikeMachineStatusMessage(message: string) {
  return /^Error\.[A-Za-z]+(?:\.[A-Za-z]+)*$/.test(message.trim());
}

function toValidationIssue(value: unknown): ValidationIssue | null {
  if (typeof value === "string") {
    return { message: value };
  }

  if (!isRecord(value)) {
    return null;
  }

  const message = value.message;
  const path = value.path;

  if (typeof message !== "string") {
    return null;
  }

  return {
    message,
    path: typeof path === "string" ? path : undefined,
  };
}

function normalizePayloadMessage(payload: unknown): {
  details?: unknown;
  issues?: ValidationIssue[];
  message: string;
} {
  if (typeof payload === "string") {
    return { message: payload };
  }

  if (Array.isArray(payload)) {
    const issues = payload
      .map((issue) => toValidationIssue(issue))
      .filter((issue): issue is ValidationIssue => issue !== null);

    if (issues.length > 0) {
      return {
        message: issues.map((issue) => issue.message).join(", "),
        issues,
      };
    }

    return {
      details: payload,
      message: payload.map((item) => String(item)).join(", "),
    };
  }

  if (isRecord(payload)) {
    const nestedMessage = payload.message;

    if (nestedMessage !== undefined) {
      const normalizedNested = normalizePayloadMessage(nestedMessage);
      return {
        details: payload,
        issues: normalizedNested.issues,
        message: normalizedNested.message,
      };
    }

    return {
      details: payload,
      message: JSON.stringify(payload),
    };
  }

  if (payload == null) {
    return { message: "" };
  }

  return {
    details: payload,
    message: String(payload),
  };
}

export class ApiError extends Error {
  code: string | null;
  details?: unknown;
  errorCode: string | null;
  issues?: ValidationIssue[];
  requestId: string | null;
  status: ApiErrorStatus | null;

  constructor(params: {
    code?: string | null;
    details?: unknown;
    errorCode?: string | null;
    issues?: ValidationIssue[];
    message: string;
    requestId?: string | null;
    status?: ApiErrorStatus | null;
  }) {
    super(params.message);
    this.name = "ApiError";
    this.code = params.code ?? null;
    this.details = params.details;
    this.errorCode = params.errorCode ?? null;
    this.issues = params.issues;
    this.requestId = params.requestId ?? null;
    this.status = params.status ?? null;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export type PermissionAwareApiError = ApiError & {
  readonly status: 401 | 403;
};

export function isPermissionAwareApiError(
  error: unknown,
): error is PermissionAwareApiError {
  return isApiError(error) && (error.status === 401 || error.status === 403);
}

export function isUnauthorizedError(error: unknown): error is ApiError {
  return isApiError(error) && error.status === 401;
}

export function isForbiddenError(error: unknown): error is ApiError {
  return isApiError(error) && error.status === 403;
}

export function isNotFoundError(error: unknown): error is ApiError {
  return isApiError(error) && error.status === 404;
}

export function isConflictError(error: unknown): error is ApiError {
  return isApiError(error) && error.status === 409;
}

export function isValidationError(error: unknown): error is ApiError {
  return isApiError(error) && error.status === 422;
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? null;
    const responseData = error.response?.data;
    const responseRecord = isRecord(responseData) ? responseData : null;
    const normalized = normalizePayloadMessage(
      responseRecord && "message" in responseRecord
        ? responseRecord.message
        : responseData,
    );
    const responseErrors =
      responseRecord && "errors" in responseRecord
        ? normalizePayloadMessage(responseRecord.errors)
        : null;
    const issues = normalized.issues ?? responseErrors?.issues;
    const transportErrorCode =
      error.code === "ERR_NETWORK"
        ? "Error.Network.RequestFailed"
        : error.code === "ECONNABORTED"
          ? "Error.Network.Timeout"
          : null;
    const errorCode =
      responseRecord && typeof responseRecord.errorCode === "string"
        ? responseRecord.errorCode
        : looksLikeMachineStatusMessage(normalized.message)
          ? normalized.message
          : transportErrorCode;
    const requestId =
      responseRecord && typeof responseRecord.requestId === "string"
        ? responseRecord.requestId
        : null;

    const fallbackMessage =
      error.code === "ERR_NETWORK"
        ? "Network request failed"
        : error.code === "ECONNABORTED"
          ? "The request timed out. Please try again later."
        : error.message || getStatusFallbackMessage(status);

    return new ApiError({
      code: error.code ?? null,
      details: normalized.details ?? responseData,
      errorCode,
      issues,
      message:
        ((looksLikeMachineStatusMessage(normalized.message) ||
          normalized.message.trim().length === 0) &&
        getStatusFallbackMessage(status)
          ? getStatusFallbackMessage(status)
          : normalized.message) ||
        getStatusFallbackMessage(status) ||
        fallbackMessage,
      requestId,
      status,
    });
  }

  if (error instanceof Error) {
    return new ApiError({
      message: error.message,
    });
  }

  return new ApiError({
    message: "Request failed",
  });
}
