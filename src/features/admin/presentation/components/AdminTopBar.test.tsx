import { renderWithProviders } from "@/test/render";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AdminTopBar from "./AdminTopBar";

vi.mock("@/features/auth/presentation/hooks/useAuthSession", () => ({
  useAuthSession: () => ({
    user: {
      id: 1,
      role: "admin",
      roleId: 1,
    },
  }),
}));

vi.mock("@/features/auth/presentation/hooks/useAuthProfileQuery", () => ({
  useAuthProfileQuery: () => ({
    data: {
      avatarUrl: null,
      fullName: "Admin User",
      initials: "AD",
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
        pathname="/admin"
        config={{
          initials: "AD",
          searchPlaceholderKey: "searchPlaceholder",
          titleKey: "dashboard",
          topBarVariant: "dashboard",
        }}
      />,
    );

    expect(screen.getByText("4")).toBeInTheDocument();
    expect(
      container.querySelector('a[href="/admin/notifications"]'),
    ).not.toBeNull();
  });
});
