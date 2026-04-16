import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { isApiError } from "@/lib/api/errors";

export const queryClientConfig = {
  gcTime: 5 * 60_000,
  staleTime: 60_000,
} as const;

function shouldRetryQuery(failureCount: number, error: unknown) {
  if (failureCount >= 1) {
    return false;
  }

  if (!isApiError(error)) {
    return true;
  }

  if (error.status == null) {
    return true;
  }

  return error.status >= 500;
}

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      mutations: {
        retry: false,
      },
      queries: {
        gcTime: queryClientConfig.gcTime,
        retry: shouldRetryQuery,
        staleTime: queryClientConfig.staleTime,
      },
    },
    mutationCache: new MutationCache(),
    queryCache: new QueryCache(),
  });
}
