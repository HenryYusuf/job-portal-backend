export interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: any;
}

export function sendSuccess<T>(data: T, meta?: any): SuccessResponse<T> {
  return {
    success: true,
    data,
    ...(meta && { meta }),
  };
}

export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
  };
}

export function sendError(message: string, code?: string): ErrorResponse {
  return {
    success: false,
    error: {
      message,
      ...(code && { code }),
    },
  };
}

export interface PaginationMeta {
  total: number;
  limit: number;
  page: number;
  totalPages: number;
}

export function formatPagination(
  total: number,
  limit: number,
  page: number
): PaginationMeta {
  return {
    total,
    limit,
    page,
    totalPages: limit > 0 ? Math.ceil(total / limit) : 0,
  };
}
