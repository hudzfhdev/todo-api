import { type StatusMap } from "elysia";

export function response<TResponse extends unknown, TError extends unknown>(
  response: {
    data: TResponse;
    pagination?: {
      total: number;
      page: number;
      offset: number;
      next_page?: number | null;
      prev_page?: number | null;
    };
  },
  status: keyof StatusMap = "OK",
  error: TError | null = null,
) {
  return {
    data: response,
    error,
    status,
  };
}
