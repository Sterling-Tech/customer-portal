
import axios from "axios";

export const getErrorMessage = (error: unknown): string => {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return "You're offline. Please check your internet connection.";
  }

  // Extract the actual response body from Axios errors.
  const data = axios.isAxiosError(error)
    ? error.response?.data
    : error;

  if (!data) {
    return "An unexpected error occurred. Please try again.";
  }

  // Backend may return a plain string.
  if (typeof data === "string") {
    return data;
  }

  if (typeof data === "object") {
    const response = data as Record<string, unknown>;

    // Handle the common DRF error format first.
    if (typeof response.detail === "string") {
      return response.detail;
    }

    if (typeof response.message === "string") {
      return response.message;
    }

    if (typeof response.error === "string") {
      return response.error;
    }

    // Handle field validation errors:
    // { email: ["This field is required."] }
    for (const value of Object.values(response)) {
      if (Array.isArray(value) && value.length > 0) {
        return String(value[0]);
      }

      if (typeof value === "string") {
        return value;
      }
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
};
