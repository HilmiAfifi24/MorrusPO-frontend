import type { AppApiError } from "../api/client/types";

export function getErrorMessage(
  error: unknown,
  fallback = "Terjadi kesalahan saat memproses permintaan.",
) {
  if (typeof error === "object" && error && "message" in error) {
    const message = (error as AppApiError).message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return fallback;
}
