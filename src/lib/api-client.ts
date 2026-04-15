type ApiClientOptions = RequestInit & {
  baseUrl?: string;
  token?: string | null;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const { baseUrl = API_BASE_URL, headers, token, ...init } = options;
  const requestHeaders = new Headers(headers);

  requestHeaders.set("Accept", "application/json");

  if (!requestHeaders.has("Content-Type") && init.body) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...init,
    headers: requestHeaders,
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
