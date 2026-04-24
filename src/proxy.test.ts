import { describe, expect, it } from "vitest";
import type { NextRequest } from "next/server";
import { proxy } from "./proxy";

function createAccessToken(roleName: string, roleId: number) {
  const payload = Buffer.from(
    JSON.stringify({
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      roleId,
      roleName,
      userId: 1,
    }),
  ).toString("base64url");

  return `header.${payload}.signature`;
}

function createRequest(pathname: string, accessToken?: string) {
  const url = `http://localhost${pathname}`;

  return {
    cookies: {
      get: (key: string) =>
        key === "emerald-logistics.access-token" && accessToken
          ? { value: accessToken }
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

  it("lets admins access other dashboard workspaces", () => {
    const request = createRequest(
      "/vi/dashboard/driver",
      createAccessToken("admin", 1),
    );

    const response = proxy(request);

    expect(response.headers.get("location")).toBeNull();
  });

  it("lets admins access customer root routes without forcing a customer redirect", () => {
    const request = createRequest("/vi/orders", createAccessToken("admin", 1));

    const response = proxy(request);

    expect(response.headers.get("location")).toBeNull();
  });

  it("still redirects dashboard root to the admin workspace", () => {
    const request = createRequest("/en/dashboard", createAccessToken("admin", 1));

    const response = proxy(request);

    expect(response.headers.get("location")).toBe(
      "http://localhost/en/dashboard/admin",
    );
  });

  it("redirects non-admin users away from restricted dashboard workspaces", () => {
    const request = createRequest(
      "/vi/dashboard/driver",
      createAccessToken("customer", 2),
    );

    const response = proxy(request);

    expect(response.headers.get("location")).toBe("http://localhost/vi/overview");
  });

  it("redirects drivers away from customer checkout routes", () => {
    const request = createRequest(
      "/en/checkout?orderId=21",
      createAccessToken("driver", 3),
    );

    const response = proxy(request);

    expect(response.headers.get("location")).toBe(
      "http://localhost/en/dashboard/driver?orderId=21",
    );
  });
});
