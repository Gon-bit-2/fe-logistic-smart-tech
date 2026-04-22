import { describe, expect, it } from "vitest";
import type { NextRequest } from "next/server";
import { proxy } from "./proxy";

function createAccessToken(roleName: string, roleId: number) {
  const payload = Buffer.from(
    JSON.stringify({
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
  it("lets admins access other dashboard workspaces", () => {
    const request = createRequest(
      "/dashboard/driver",
      createAccessToken("admin", 1),
    );

    const response = proxy(request);

    expect(response.headers.get("location")).toBeNull();
  });

  it("lets admins access customer root routes without forcing a customer redirect", () => {
    const request = createRequest(
      "/orders",
      createAccessToken("admin", 1),
    );

    const response = proxy(request);

    expect(response.headers.get("location")).toBeNull();
  });

  it("still redirects dashboard root to the admin workspace", () => {
    const request = createRequest(
      "/dashboard",
      createAccessToken("admin", 1),
    );

    const response = proxy(request);

    expect(response.headers.get("location")).toBe("http://localhost/dashboard/admin");
  });

  it("redirects non-admin users away from restricted dashboard workspaces", () => {
    const request = createRequest(
      "/dashboard/driver",
      createAccessToken("customer", 2),
    );

    const response = proxy(request);

    expect(response.headers.get("location")).toBe("http://localhost/dashboard/customer");
  });
});
