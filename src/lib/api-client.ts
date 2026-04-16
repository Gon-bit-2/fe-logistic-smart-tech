import { httpClient } from "@/lib/api/http-client";
import { API_BASE_URL } from "@/lib/api/env";

type ApiClientOptions = Omit<RequestInit, "body"> & {
  baseUrl?: string;
  body?: unknown;
  token?: string | null;
};

export async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const { baseUrl = API_BASE_URL, body, headers, token, ...init } = options;
  const normalizedHeaders = Object.fromEntries(new Headers(headers).entries());

  if (token) {
    normalizedHeaders.Authorization = `Bearer ${token}`;
  }

  const response = (await httpClient.request({
    baseURL: baseUrl,
    data: body ?? undefined,
    headers: normalizedHeaders,
    method: init.method,
    signal: init.signal ?? undefined,
    url: endpoint,
  })) as { data: T };

  return response.data;
}
