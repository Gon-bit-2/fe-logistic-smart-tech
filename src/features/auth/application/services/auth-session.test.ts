import { describe, expect, it } from "vitest";
import {
  getDashboardHrefForRole,
  getNotificationsHrefForRole,
  getRoleRequestHrefForRole,
} from "./auth-session";

describe("auth-session route helpers", () => {
  it("returns dashboard hrefs by role", () => {
    expect(getDashboardHrefForRole("admin")).toBe("/dashboard/admin");
    expect(getDashboardHrefForRole("driver")).toBe("/dashboard/driver");
  });

  it("returns notifications hrefs by role", () => {
    expect(getNotificationsHrefForRole("admin")).toBe(
      "/dashboard/admin/notifications",
    );
    expect(getNotificationsHrefForRole("warehouse_staff")).toBe(
      "/dashboard/warehouse/notifications",
    );
  });

  it("returns role request hrefs by role", () => {
    expect(getRoleRequestHrefForRole("customer")).toBe("/dashboard/customer/roles");
    expect(getRoleRequestHrefForRole("driver")).toBe("/dashboard/driver/roles");
  });
});
