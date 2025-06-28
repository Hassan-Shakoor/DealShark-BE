interface ApiError extends Error {
  response?: {
    status: number;
    data?: any;
  };
  code?: string;
  config?: any;
}

interface RetryableFunction<T> {
  (): Promise<T>;
}

export const retryApiCall = async <T>(
  apiCall: RetryableFunction<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
): Promise<T> => {
  let lastError: ApiError | Error | unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log("Attempting API call");
      const response = await apiCall();
      return response;
    } catch (error) {
      lastError = error;

      // Type guard to check if error has response property
      const isApiError = (err: unknown): err is ApiError => {
        return typeof err === "object" && err !== null && "response" in err;
      };

      // Don't retry on client errors (4xx) except for specific cases
      if (isApiError(error) && error.response?.status) {
        const status = error.response.status;
        if (status >= 400 && status < 500) {
          // Only retry on rate limiting (429) or timeout-related 4xx errors
          if (status !== 429 && status !== 408) {
            throw error;
          }
        }
      }

      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Calculate delay with exponential backoff and jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.warn(
        `[retryApiCall] API call failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${Math.round(delay)}ms...`,
        errorMessage,
        { attempt, maxRetries, baseDelay, delay, error },
      );

      await new Promise<void>((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};
