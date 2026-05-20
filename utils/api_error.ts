import axios, { AxiosError } from "axios";

export default class ApiError extends Error {
  statusCode?: number;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const handleApiError = (
  error: Error | AxiosError | string | unknown,
): ApiError => {
  let message = "An error occurred, please try again later";

  if (axios.isAxiosError(error)) {
    const responseData = error?.response?.data as
      | {
          message?: string;
          error?: string[] | string;
          errors?: Record<string, string[] | string> | undefined;
          detail?: string | undefined;
        }
      | undefined;

    if (Array.isArray(responseData?.error) && responseData.error.length > 0) {
      message = responseData.error.join(", ");
    } else if (responseData?.message) {
      message = responseData.message;
    } else if (typeof responseData?.error === "string" && responseData.error) {
      message = responseData.error;
    } else if (
      responseData?.errors &&
      typeof responseData.errors === "object"
    ) {
      const flattened = Object.entries(responseData.errors).flatMap(
        ([field, value]) => {
          if (Array.isArray(value)) {
            return value.map((v) => `${field}: ${v}`);
          }
          return [`${field}: ${value}`];
        },
      );
      if (flattened.length > 0) {
        message = flattened.join(", ");
      }
    } else if (responseData?.detail) {
      message = responseData.detail;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return new ApiError(message);
};
