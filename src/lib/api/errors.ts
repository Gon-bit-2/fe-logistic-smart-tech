import axios from "axios";
import type { ValidationIssue } from "@/types/common.type";

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

  return "Request failed";
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
    return { message: "Request failed" };
  }

  return {
    details: payload,
    message: String(payload),
  };
}

export class ApiError extends Error {
  code: string | null;
  details?: unknown;
  issues?: ValidationIssue[];
  status: number | null;

  constructor(params: {
    code?: string | null;
    details?: unknown;
    issues?: ValidationIssue[];
    message: string;
    status?: number | null;
  }) {
    super(params.message);
    this.name = "ApiError";
    this.code = params.code ?? null;
    this.details = params.details;
    this.issues = params.issues;
    this.status = params.status ?? null;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? null;
    const responseData = error.response?.data;
    const normalized = normalizePayloadMessage(
      isRecord(responseData) && "message" in responseData
        ? responseData.message
        : responseData,
    );

    const fallbackMessage =
      error.code === "ERR_NETWORK"
        ? "Network request failed"
        : error.message || getStatusFallbackMessage(status);

    return new ApiError({
      code: error.code ?? null,
      details: normalized.details ?? responseData,
      issues: normalized.issues,
      message: normalized.message || getStatusFallbackMessage(status) || fallbackMessage,
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
