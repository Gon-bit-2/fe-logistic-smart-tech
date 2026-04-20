import { vi } from "vitest";

const router = {
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
  push: vi.fn(),
  refresh: vi.fn(),
  replace: vi.fn(),
};

let pathname = "/";
let searchParams = new URLSearchParams();

export const nextNavigationMock = {
  usePathname: () => pathname,
  useRouter: () => router,
  useSearchParams: () => searchParams,
};

export function resetNextNavigationMocks() {
  pathname = "/";
  searchParams = new URLSearchParams();
  Object.values(router).forEach((mock) => mock.mockReset());
}

export function setMockPathname(nextPathname: string) {
  pathname = nextPathname;
}

export function setMockSearchParams(
  nextSearchParams?: Record<string, string | null | undefined> | URLSearchParams,
) {
  if (!nextSearchParams) {
    searchParams = new URLSearchParams();
    return;
  }

  if (nextSearchParams instanceof URLSearchParams) {
    searchParams = new URLSearchParams(nextSearchParams);
    return;
  }

  const params = new URLSearchParams();
  Object.entries(nextSearchParams).forEach(([key, value]) => {
    if (value != null) {
      params.set(key, value);
    }
  });
  searchParams = params;
}

export function getMockRouter() {
  return router;
}
