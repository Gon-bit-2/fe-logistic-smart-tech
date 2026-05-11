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

type MockAxiosInstance = ReturnType<typeof vi.fn> & {
  __requestHandler?: (config: unknown) => Promise<{
    headers: MockAxiosHeaders;
  }>;
  __responseFulfilled?: (response: unknown) => unknown;
  __responseRejected?: (error: unknown) => Promise<unknown>;
  delete: ReturnType<typeof vi.fn>;
  get: ReturnType<typeof vi.fn>;
  interceptors: {
    request: {
      use: ReturnType<typeof vi.fn>;
    };
    response: {
      use: ReturnType<typeof vi.fn>;
    };
  };
  patch: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
};

function createAxiosInstance() {
  const instance = vi.fn() as MockAxiosInstance;

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

function createAccessToken(expOffsetSeconds: number) {
  const payload = {
    exp: Math.floor(Date.now() / 1000) + expOffsetSeconds,
    roleId: 2,
    roleName: "customer",
    userId: 1,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");

  return `header.${encodedPayload}.signature`;
}

describe("http-client", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("injects the access token into outgoing requests", async () => {
    const httpClientMock = createAxiosInstance();
    const create = vi.fn().mockReturnValue(httpClientMock);
    const accessToken = createAccessToken(60 * 60);

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
        accessToken,
      })),
      setAuthSession: vi.fn(),
    }));
    vi.doMock("@/lib/api/session-client", () => ({
      restoreSession: vi.fn(),
    }));

    const { httpClient } = await import("./http-client");

    const config = {
      headers: new MockAxiosHeaders(),
    };
    const nextConfig = await httpClientMock.__requestHandler?.(config);

    expect(nextConfig?.headers.get("authorization")).toBe(`Bearer ${accessToken}`);
  });

  it("refreshes an expiring access token before sending the request", async () => {
    const httpClientMock = createAxiosInstance();
    const create = vi.fn().mockReturnValue(httpClientMock);
    const clearAuthSession = vi.fn();
    const setAuthSession = vi.fn();
    const newAccessToken = createAccessToken(60 * 60);
    const restoreSession = vi.fn().mockResolvedValue({
      accessToken: newAccessToken,
      profile: {
        avatarUrl: null,
        email: "customer@emerald.com",
        fullName: "Customer",
        hubId: null,
        id: 1,
        initials: "CU",
        phone: null,
        role: "customer",
        roleId: 2,
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
      getAuthSessionSnapshot: vi.fn(() => ({
        accessToken: createAccessToken(-10),
      })),
      setAuthSession,
    }));
    vi.doMock("@/lib/api/session-client", () => ({
      restoreSession,
    }));

    const { httpClient } = await import("./http-client");

    const config = {
      headers: new MockAxiosHeaders(),
      url: "/maps/places/autocomplete",
    };
    const nextConfig = await httpClientMock.__requestHandler?.(config);

    expect(restoreSession).toHaveBeenCalledTimes(1);
    expect(setAuthSession).toHaveBeenCalledWith({
      accessToken: newAccessToken,
      profile: {
        avatarUrl: null,
        email: "customer@emerald.com",
        fullName: "Customer",
        hubId: null,
        id: 1,
        initials: "CU",
        phone: null,
        role: "customer",
        roleId: 2,
      },
    });
    expect(clearAuthSession).not.toHaveBeenCalled();
    expect(nextConfig?.headers.get("authorization")).toBe(`Bearer ${newAccessToken}`);
  });

  it("refreshes the session and retries the failed request on 401", async () => {
    const httpClientMock = createAxiosInstance();
    const create = vi.fn().mockReturnValue(httpClientMock);
    const clearAuthSession = vi.fn();
    const getAuthSessionSnapshot = vi.fn(() => ({
      accessToken: null,
    }));
    const setAuthSession = vi.fn();
    const restoreSession = vi.fn().mockResolvedValue({
      accessToken: "new-access-token",
      profile: {
        avatarUrl: null,
        email: "customer@emerald.com",
        fullName: "Customer",
        hubId: null,
        id: 1,
        initials: "CU",
        phone: null,
        role: "customer",
        roleId: 2,
      },
    });

    httpClientMock.mockResolvedValue({
      data: { ok: true },
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
      setAuthSession,
    }));
    vi.doMock("@/lib/api/session-client", () => ({
      restoreSession,
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

    await expect(httpClientMock.__responseRejected?.(error)).resolves.toEqual({
      data: { ok: true },
    });

    expect(restoreSession).toHaveBeenCalledTimes(1);
    expect(setAuthSession).toHaveBeenCalledWith({
      accessToken: "new-access-token",
      profile: {
        avatarUrl: null,
        email: "customer@emerald.com",
        fullName: "Customer",
        hubId: null,
        id: 1,
        initials: "CU",
        phone: null,
        role: "customer",
        roleId: 2,
      },
    });
    expect(clearAuthSession).not.toHaveBeenCalled();
    expect(httpClientMock).toHaveBeenCalledTimes(1);
    expect(httpClientMock.mock.calls[0][0].headers.get("authorization")).toBe(
      "Bearer new-access-token",
    );
  });
});
