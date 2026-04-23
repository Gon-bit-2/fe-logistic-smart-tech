export type ValidationIssue = {
  message: string;
  path?: string;
};

export type ApiErrorStatus = 401 | 403 | 404 | 409 | 422 | number;

export type SessionTokens = {
  accessToken: string;
  refreshToken?: string | null;
};

export type PaginatedResult<T> = {
  data: T[];
  totalItems: number;
};

export type PaginationParams = {
  page?: number;
  limit?: number;
};

export type ApiListResponse<T> = PaginatedResult<T>;
