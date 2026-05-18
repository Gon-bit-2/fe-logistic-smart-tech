import { ApiError } from "@/lib/api/errors";
import type { SessionBootstrapPayload } from "@/types/common.type";

async function parseJsonSafe(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function toApiError(response: Response, payload: unknown) {
  const payloadRecord =
    typeof payload === "object" && payload !== null
      ? (payload as Record<string, unknown>)
      : null;
  const errorCode =
    payloadRecord && typeof payloadRecord.errorCode === "string"
      ? payloadRecord.errorCode
      : response.status === 401
        ? "Error.Auth.SessionExpired"
        : null;
  const message =
    payloadRecord && typeof payloadRecord.message === "string"
      ? payloadRecord.message
      : response.status === 401
        ? "Your session has expired. Please log in again."
        : "Request failed";

  throw new ApiError({
    details: payload,
    errorCode,
    message,
    status: response.status,
  });
}

export async function restoreSession() {
  const response = await fetch("/api/auth/session", {
    cache: "no-store",
    credentials: "same-origin",
    method: "GET",
  });

  if (response.status === 204) {
    return null;
  }

  const payload = await parseJsonSafe(response);

  if (!response.ok) {
    return toApiError(response, payload);
  }

  return payload as SessionBootstrapPayload;
}

export async function destroySession() {
  const response = await fetch("/api/auth/session", {
    cache: "no-store",
    credentials: "same-origin",
    method: "DELETE",
  });

  if (response.status === 204) {
    return null;
  }

  const payload = await parseJsonSafe(response);

  if (!response.ok) {
    return toApiError(response, payload);
  }

  return payload;
}
