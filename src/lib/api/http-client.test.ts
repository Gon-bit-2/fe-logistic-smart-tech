import { beforeEach, describe, expect, it, vi } from "vitest";

class MockAxiosHeaders {
  private readonly store = new Map<string, string>();

  constructor(source?: Record<string, string>) {
    Object.entries(source ?? {}).forEach(([key, value]) => {
      this.set(key, value);
    });
  }

  has(key: string) {
    return this.store.has(key.toLowerCase());
  }

  set(key: string, value: string) {
    this.store.set(key.toLowerCase(), value);
  }

  get(key: string) {
    return this.store.get(key.toLowerCase()) ?? null;
  }

  toJSON() {
    return Object.fromEntries(this.store.entries());
  }
}

function createAxiosInstance() {
  const instance: any = vi.fn();

  instance.interceptors = {
    request: {
      use: vi.fn((handler: unknown) => {
        instance.__requestHandler = handler;
        return 0;
      }),
    },
    response: {
      use: vi.fn((onFulfilled: unknown, onRejected: unknown) => {
        instance.__responseFulfilled = onFulfilled;
        instance.__responseRejected = onRejected;
        return 0;
      }),
    },
  };

  instance.post = vi.fn();
  instance.get = vi.fn();
  instance.put = vi.fn();
  instance.patch = vi.fn();
  instance.delete = vi.fn();

  return instance;
}

describe("http-client", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("injects the access token into outgoing requests", async () => {
    const httpClientMock = createAxiosInstance();
    const refreshClientMock = createAxiosInstance();
    const create = vi
      .fn()
      .mockReturnValueOnce(httpClientMock)
      .mockReturnValueOnce(refreshClientMock);

    vi.doMock("axios", () => ({
      default: {
        create,
        isAxiosError: (error: unknown) => Boolean((error as { isAxiosError?: boolean })?.isAxiosError),
      },
      create,
      isAxiosError: (error: unknown) => Boolean((error as { isAxiosError?: boolean })?.isAxiosError),
      AxiosHeaders: MockAxiosHeaders,
    }));
    vi.doMock("@/lib/api/env", () => ({
      API_BASE_URL: "http://localhost:8386",
    }));
    vi.doMock("@/features/auth/presentation/state/auth.store", () => ({
      clearAuthSession: vi.fn(),
      getAuthSessionSnapshot: vi.fn(() => ({
        accessToken: "access-token",
        refreshToken: "refresh-token",
      })),
      setAuthSessionTokens: vi.fn(),
    }));

    const { httpClient } = await import("./http-client");

    const config = {
      headers: new MockAxiosHeaders(),
    };
    const nextConfig = await (httpClient as any).__requestHandler(config);

    expect(nextConfig.headers.get("authorization")).toBe("Bearer access-token");
  });

  it("refreshes the session and retries the failed request on 401", async () => {
    const httpClientMock = createAxiosInstance();
    const refreshClientMock = createAxiosInstance();
    const create = vi
      .fn()
      .mockReturnValueOnce(httpClientMock)
      .mockReturnValueOnce(refreshClientMock);
    const clearAuthSession = vi.fn();
    const getAuthSessionSnapshot = vi.fn(() => ({
      accessToken: null,
      refreshToken: "refresh-token",
    }));
    const setAuthSessionTokens = vi.fn();

    httpClientMock.mockResolvedValue({
      data: { ok: true },
    });
    refreshClientMock.post.mockResolvedValue({
      data: {
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
      },
    });

    vi.doMock("axios", () => ({
      default: {
        create,
        isAxiosError: (error: unknown) => Boolean((error as { isAxiosError?: boolean })?.isAxiosError),
      },
      create,
      isAxiosError: (error: unknown) => Boolean((error as { isAxiosError?: boolean })?.isAxiosError),
      AxiosHeaders: MockAxiosHeaders,
    }));
    vi.doMock("@/lib/api/env", () => ({
      API_BASE_URL: "http://localhost:8386",
    }));
    vi.doMock("@/features/auth/presentation/state/auth.store", () => ({
      clearAuthSession,
      getAuthSessionSnapshot,
      setAuthSessionTokens,
    }));

    const { httpClient } = await import("./http-client");

    const error = {
      isAxiosError: true,
      code: "ERR_BAD_REQUEST",
      config: {
        url: "/orders",
        headers: new MockAxiosHeaders(),
      },
      response: {
        status: 401,
        data: {
          message: "expired",
        },
        statusText: "Unauthorized",
        headers: {},
        config: {
          headers: new MockAxiosHeaders(),
        },
      },
    };

    await expect((httpClient as any).__responseRejected(error)).resolves.toEqual({
      data: { ok: true },
    });

    expect(refreshClientMock.post).toHaveBeenCalledWith("/auth/refresh-token", {
      refreshToken: "refresh-token",
    });
    expect(setAuthSessionTokens).toHaveBeenCalledWith({
      accessToken: "new-access-token",
      refreshToken: "new-refresh-token",
    });
    expect(clearAuthSession).not.toHaveBeenCalled();
    expect(httpClientMock).toHaveBeenCalledTimes(1);
    expect(httpClientMock.mock.calls[0][0].headers.get("authorization")).toBe(
      "Bearer new-access-token",
    );
  });
});
