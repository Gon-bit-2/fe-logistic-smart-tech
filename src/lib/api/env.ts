export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "";

export const hasApiBaseUrl = API_BASE_URL.trim().length > 0;
