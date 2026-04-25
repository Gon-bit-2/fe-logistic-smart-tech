import axios, { AxiosHeaders } from "axios";
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { clearAuthSession, getAuthSessionSnapshot, setAuthSessionTokens } from "@/features/auth/presentation/state/auth.store";
import { isAccessTokenExpiringSoon } from "@/features/auth/application/services/auth-session";
import { restoreSession } from "@/lib/api/session-client";
import type { SessionTokens } from "@/types/common.type";
import { API_BASE_URL } from "./env";
import { ApiError, normalizeApiError } from "./errors";

type RetryableAxiosRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  skipAuthRefresh?: boolean;
};

const REFRESH_EXCLUDED_PATHS = new Set([
  "/auth/forgot-password",
  "/auth/login",
  "/auth/otp",
  "/auth/refresh-token",
  "/auth/register",
]);

function getPathname(url?: string) {
  if (!url) {
    return "";
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return new URL(url).pathname;
  }

  return url;
}

function shouldSkipRefresh(config?: RetryableAxiosRequestConfig) {
  if (!config) {
    return true;
  }

  if (config.skipAuthRefresh || config._retry) {
    return true;
  }

  return REFRESH_EXCLUDED_PATHS.has(getPathname(config.url));
}

function setAuthorizationHeader(
  config: AxiosRequestConfig,
  accessToken: string,
) {
  const headers = toAxiosHeaders(config.headers);

  headers.set("Authorization", `Bearer ${accessToken}`);
  config.headers = headers;
}

function toAxiosHeaders(configHeaders: AxiosRequestConfig["headers"]) {
  const headers = new AxiosHeaders();

  if (!configHeaders) {
    return headers;
  }

  const source =
    configHeaders instanceof AxiosHeaders
      ? configHeaders.toJSON()
      : (configHeaders as Record<string, unknown>);

  Object.entries(source).forEach(([key, value]) => {
    if (value != null) {
      headers.set(key, String(value));
    }
  });

  return headers;
}

const defaultHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: defaultHeaders,
});

let refreshPromise: Promise<SessionTokens> | null = null;

async function refreshSessionTokens() {
  const tokens = await restoreSession();

  if (!tokens?.accessToken) {
    throw new ApiError({
      message: "Your session has expired. Please log in again.",
      status: 401,
    });
  }

  return tokens;
}

async function getRefreshPromise() {
  if (!refreshPromise) {
    refreshPromise = refreshSessionTokens()
      .then((tokens) => {
        setAuthSessionTokens(tokens);
        return tokens;
      })
      .catch((error) => {
        clearAuthSession();
        throw normalizeApiError(error);
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

httpClient.interceptors.request.use((config) => {
  if (shouldSkipRefresh(config)) {
    return config;
  }

  const { accessToken } = getAuthSessionSnapshot();
  const headers = toAxiosHeaders(config.headers);

  if (!accessToken || headers.has("Authorization")) {
    return config;
  }

  if (!isAccessTokenExpiringSoon(accessToken)) {
    setAuthorizationHeader(config, accessToken);
    return config;
  }

  return getRefreshPromise().then((tokens) => {
    setAuthorizationHeader(config, tokens.accessToken);
    return config;
  });
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    const normalizedError = normalizeApiError(error);

    if (!axios.isAxiosError(error)) {
      throw normalizedError;
    }

    const originalRequest = error.config as RetryableAxiosRequestConfig | undefined;
    const status = error.response?.status;

    if (status !== 401 || shouldSkipRefresh(originalRequest)) {
      throw normalizedError;
    }

    if (!originalRequest) {
      throw normalizedError;
    }

    originalRequest._retry = true;

    try {
      const tokens = await getRefreshPromise();
      setAuthorizationHeader(originalRequest, tokens.accessToken);
      return await httpClient(originalRequest);
    } catch (refreshError) {
      throw normalizeApiError(refreshError);
    }
  },
);
