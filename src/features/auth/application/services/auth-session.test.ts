import { describe, expect, it } from "vitest";
import {
  getDashboardHrefForRole,
  getNotificationsHrefForRole,
  getRoleRequestHrefForRole,
  normalizeUserRole,
  toAuthProfile,
} from "./auth-session";

function createUnsignedAccessToken(payload: Record<string, unknown>) {
  const encode = (value: Record<string, unknown>) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");

  return `${encode({ alg: "none", typ: "JWT" })}.${encode(payload)}.`;
}

describe("auth-session route helpers", () => {
  it("returns dashboard hrefs by role", () => {
    expect(getDashboardHrefForRole("admin")).toBe("/admin");
    expect(getDashboardHrefForRole("customer")).toBe("/overview");
    expect(getDashboardHrefForRole("driver")).toBe("/driver");
  });

  it("returns notifications hrefs by role", () => {
    expect(getNotificationsHrefForRole("admin")).toBe(
      "/admin/notifications",
    );
    expect(getNotificationsHrefForRole("customer")).toBe("/notifications");
    expect(getNotificationsHrefForRole("warehouse_staff")).toBe(
      "/warehouse/notifications",
    );
  });

  it("returns role request hrefs by role", () => {
    expect(getRoleRequestHrefForRole("customer")).toBe("/role-requests");
    expect(getRoleRequestHrefForRole("driver")).toBe("/driver/roles");
  });
});

describe("auth-session profile mapping", () => {
  it("prefers backend role names over seed-dependent role ids", () => {
    expect(normalizeUserRole("WAREHOUSE_STAFF", 2)).toBe("warehouse_staff");
  });

  it("maps the documented nested role profile shape", () => {
    const profile = toAuthProfile({
      email: "warehouse@example.com",
      fullName: "Warehouse User",
      hubId: 10,
      id: 7,
      role: {
        id: 4,
        name: "WAREHOUSE_STAFF",
        permissions: [],
      },
      roleId: 2,
    });

    expect(profile).toMatchObject({
      email: "warehouse@example.com",
      hubId: 10,
      id: 7,
      role: "warehouse_staff",
      roleId: 4,
    });
  });

  it("uses the verified access-token role when the current backend profile is flat", () => {
    const accessToken = createUnsignedAccessToken({
      deviceId: 1,
      exp: Math.floor(Date.now() / 1000) + 60,
      iat: Math.floor(Date.now() / 1000),
      roleId: 3,
      roleName: "DRIVER",
      userId: 8,
    });

    const profile = toAuthProfile(
      {
        email: "driver@example.com",
        fullName: "Driver User",
        id: 8,
      },
      { verifiedAccessToken: accessToken },
    );

    expect(profile).toMatchObject({
      id: 8,
      role: "driver",
      roleId: 3,
    });
  });

  it("falls back to roleId for the current backend profile when no verified token is available", () => {
    const profile = toAuthProfile({
      email: "customer@example.com",
      fullName: "Customer User",
      id: 9,
      roleId: 2,
    });

    expect(profile.role).toBe("customer");
    expect(profile.roleId).toBe(2);
  });

  it("rejects unsupported role profiles", () => {
    expect(() =>
      toAuthProfile({
        email: "unknown@example.com",
        id: 10,
      }),
    ).toThrow("Received an auth profile with an unsupported role.");
  });
});
