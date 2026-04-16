export type ValidationIssue = {
  message: string;
  path?: string;
};

export type SessionTokens = {
  accessToken: string;
  refreshToken: string;
};

export type PaginatedResult<T> = {
  data: T[];
  totalItems: number;
};
