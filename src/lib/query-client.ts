export const queryClientConfig = {
  staleTime: 60_000,
  gcTime: 5 * 60_000,
} as const;

export type QueryClientConfig = typeof queryClientConfig;
