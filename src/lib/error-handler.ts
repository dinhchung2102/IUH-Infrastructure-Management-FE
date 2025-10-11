import type { AxiosErrorResponse } from "@/types/error.type";

/**
 * Extract error message from API error response
 * @param error - Error object from catch block
 * @param fallbackMessage - Default message if no message found
 * @returns Error message string
 */
export function getErrorMessage(
  error: unknown,
  fallbackMessage = "Đã có lỗi xảy ra. Vui lòng thử lại."
): string {
  const err = error as AxiosErrorResponse;

  // Try to get message from API response
  if (err.response?.data?.message) {
    return err.response.data.message;
  }

  // Return fallback message
  return fallbackMessage;
}

/**
 * Get error code from API error response
 */
export function getErrorCode(error: unknown): string | undefined {
  const err = error as AxiosErrorResponse;
  return err.response?.data?.errorCode;
}

/**
 * Get status code from API error response
 */
export function getStatusCode(error: unknown): number | undefined {
  const err = error as AxiosErrorResponse;
  return err.response?.data?.statusCode;
}

/**
 * Check if error is a specific error code
 */
export function isErrorCode(error: unknown, code: string): boolean {
  return getErrorCode(error) === code;
}
