export interface ApiResponse<T> {
  succeeded: boolean;
  message: string;
  errors: string[];
  data: T;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  perPage: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationMeta;
}
