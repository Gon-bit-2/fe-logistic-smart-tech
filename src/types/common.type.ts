export type ApiResponse<T> = {
  data: T;
  message: string;
  success: boolean;
};

export type PaginationMeta = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type PaginationResponse<T> = ApiResponse<T[]> & {
  meta: PaginationMeta;
};
