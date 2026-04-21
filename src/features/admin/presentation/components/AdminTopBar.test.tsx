import { renderWithProviders } from "@/test/render";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AdminTopBar from "./AdminTopBar";

vi.mock("@/features/auth/presentation/hooks/useAuthSession", () => ({
  useAuthSession: () => ({
    user: {
      role: "admin",
    },
  }),
}));

vi.mock("@/features/notifications/presentation/hooks/useNotifications", () => ({
  useUnreadNotificationsCount: () => ({
    data: {
      totalUnread: 4,
    },
  }),
}));

describe("AdminTopBar", () => {
  it("renders the notification bell with unread badge and admin href", () => {
    const { container } = renderWithProviders(
      <AdminTopBar
        pathname="/dashboard/admin"
        config={{
          initials: "AD",
          searchPlaceholder: "Search",
          title: "Admin",
          topBarVariant: "dashboard",
        }}
      />,
    );

    expect(screen.getByText("4")).toBeInTheDocument();
    expect(
      container.querySelector('a[href="/dashboard/admin/notifications"]'),
    ).not.toBeNull();
  });
});
