import { describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";
import { proxy } from "./proxy";

vi.mock("next-intl/middleware", () => ({
  default: () => (request: NextRequest) => {
    const { pathname, search } = request.nextUrl;

    if (!/^\/(en|vi)(\/|$)/.test(pathname)) {
      return Response.redirect(new URL(`/vi${pathname}${search}`, request.url));
    }

    return new Response(null, {
      headers: new Headers(),
    });
  },
}));

function createRequest(
  pathname: string,
  {
    accessToken,
    refreshToken,
  }: {
    accessToken?: string;
    refreshToken?: string;
  } = {},
) {
  const url = `http://localhost${pathname}`;

  return {
    cookies: {
      get: (key: string) =>
        key === "emerald-logistics.access-token" && accessToken
          ? { value: accessToken }
          : key === "emerald-logistics.refresh-token" && refreshToken
            ? { value: refreshToken }
            : undefined,
    },
    nextUrl: new URL(url),
    url,
  } as NextRequest;
}

describe("proxy", () => {
  it("redirects unprefixed routes to the default Vietnamese locale", () => {
    const request = createRequest("/tracking?code=EL-1");

    const response = proxy(request);

    expect(response.headers.get("location")).toBe(
      "http://localhost/vi/tracking?code=EL-1",
    );
  });

  it("rewrites the legacy Google callback path to the flat callback page", () => {
    const request = createRequest(
      "/vi/auth/google/callback?sessionToken=test-session-token",
    );

    const response = proxy(request);

    expect(response.headers.get("x-middleware-rewrite")).toBe(
      "http://localhost/vi/auth/google-callback?sessionToken=test-session-token",
    );
  });

  it("allows protected requests with an access token to continue", () => {
    const request = createRequest("/vi/driver", {
      accessToken: "header.payload.signature",
    });

    const response = proxy(request);

    expect(response.headers.get("location")).toBeNull();
  });

  it("allows protected requests with only a refresh token to continue", () => {
    const request = createRequest("/vi/orders", {
      refreshToken: "refresh-token",
    });

    const response = proxy(request);

    expect(response.headers.get("location")).toBeNull();
  });

  it("lets dashboard root continue to the actual page when session cookies exist", () => {
    const request = createRequest("/en/dashboard", {
      accessToken: "header.payload.signature",
    });

    const response = proxy(request);

    expect(response.headers.get("location")).toBeNull();
  });

  it("redirects legacy dashboard workspace URLs to canonical paths", () => {
    const request = createRequest(
      "/vi/dashboard/admin/orders?status=pending",
      { accessToken: "header.payload.signature" },
    );

    const response = proxy(request);

    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe(
      "http://localhost/vi/admin/orders?status=pending",
    );
  });

  it("redirects legacy customer dashboard URLs to canonical customer paths", () => {
    const request = createRequest(
      "/vi/dashboard/customer/orders/create?draft=1",
      { accessToken: "header.payload.signature" },
    );

    const response = proxy(request);

    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe(
      "http://localhost/vi/orders/create?draft=1",
    );
  });

  it("redirects protected workspaces to login when session cookies are missing", () => {
    const request = createRequest("/vi/driver");

    const response = proxy(request);

    expect(response.headers.get("location")).toBe("http://localhost/vi/auth/login");
  });

  it("redirects legacy customer segment routes to canonical customer roots", () => {
    const request = createRequest(
      "/vi/customer/orders/create?draft=1",
      { accessToken: "header.payload.signature" },
    );

    const response = proxy(request);

    expect(response.headers.get("location")).toBe(
      "http://localhost/vi/orders/create?draft=1",
    );
  });
});
