import { describe, expect, it } from "vitest";
import { mapNotificationApiToViewModel } from "./notification.mapper";

describe("notification.mapper", () => {
  it("normalizes title and content when message fields are strings", () => {
    const viewModel = mapNotificationApiToViewModel(
      {
        id: 1,
        message: "Yêu cầu đã được cập nhật",
        createdAt: "2026-04-20T09:00:00.000Z",
        isRead: false,
      },
      "customer",
    );

    expect(viewModel.title).toBe("Yêu cầu đã được cập nhật");
    expect(viewModel.content).toBe("Yêu cầu đã được cập nhật");
  });

  it("normalizes object and array message fields into readable strings", () => {
    const viewModel = mapNotificationApiToViewModel(
      {
        id: 2,
        title: { message: "Role request" },
        content: [{ message: "Approved" }, { message: "by admin" }],
        createdAt: "2026-04-20T09:00:00.000Z",
      },
      "customer",
    );

    expect(viewModel.title).toBe("Role request");
    expect(viewModel.content).toBe("Approved, by admin");
  });

  it("falls back to role-request payload when text fields are missing", () => {
    const viewModel = mapNotificationApiToViewModel(
      {
        id: 3,
        payload: {
          roleRequestId: 11,
          status: "PENDING",
          targetRoleName: "WAREHOUSE_STAFF",
        },
      },
      "warehouse_staff",
    );

    expect(viewModel.title).toBe("Cập nhật yêu cầu vai trò");
    expect(viewModel.content).toContain("Warehouse Staff");
    expect(viewModel.ctaHref).toBe("/warehouse/roles");
  });
});
