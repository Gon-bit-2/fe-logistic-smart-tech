import type { ReactElement, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, renderHook, type RenderHookOptions, type RenderOptions } from "@testing-library/react";
import { createQueryClient } from "@/lib/query-client";
import {
  getMockRouter,
  resetNextNavigationMocks,
  setMockPathname,
  setMockSearchParams,
} from "@/test/next-navigation";

type SeedQuery = {
  key: readonly unknown[];
  value: unknown;
};

type ProviderOptions = {
  pathname?: string;
  queryClient?: QueryClient;
  searchParams?: Record<string, string | null | undefined> | URLSearchParams;
  seedQueries?: SeedQuery[];
};

function applyProviderState({
  pathname,
  queryClient,
  searchParams,
  seedQueries,
}: ProviderOptions = {}) {
  resetNextNavigationMocks();

  if (pathname) {
    setMockPathname(pathname);
  }

  if (searchParams) {
    setMockSearchParams(searchParams);
  }

  const client = queryClient ?? createQueryClient();
  seedQueries?.forEach(({ key, value }) => {
    client.setQueryData(key, value);
  });

  return client;
}

function TestProviders({
  children,
  queryClient,
}: Readonly<{
  children: ReactNode;
  queryClient: QueryClient;
}>) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export function renderWithProviders(
  ui: ReactElement,
  options: ProviderOptions & Omit<RenderOptions, "wrapper"> = {},
) {
  const { pathname, queryClient, searchParams, seedQueries, ...renderOptions } = options;
  const client = applyProviderState({
    pathname,
    queryClient,
    searchParams,
    seedQueries,
  });

  return {
    queryClient: client,
    router: getMockRouter(),
    ...render(ui, {
      wrapper: ({ children }) => (
        <TestProviders queryClient={client}>{children}</TestProviders>
      ),
      ...renderOptions,
    }),
  };
}

export function renderHookWithProviders<Result, Props>(
  renderCallback: (props: Props) => Result,
  options: ProviderOptions &
    Omit<RenderHookOptions<Props>, "wrapper"> = {},
) {
  const { pathname, queryClient, searchParams, seedQueries, ...renderOptions } = options;
  const client = applyProviderState({
    pathname,
    queryClient,
    searchParams,
    seedQueries,
  });

  return {
    queryClient: client,
    router: getMockRouter(),
    ...renderHook(renderCallback, {
      wrapper: ({ children }) => (
        <TestProviders queryClient={client}>{children}</TestProviders>
      ),
      ...renderOptions,
    }),
  };
}
