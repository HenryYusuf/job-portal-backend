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
