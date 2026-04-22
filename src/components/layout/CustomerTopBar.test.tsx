"use client";

import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CustomerTopBar from "@/components/layout/CustomerTopBar";
import { renderWithProviders } from "@/test/render";

const useAuthMock = vi.fn();
const useAuthProfileQueryMock = vi.fn();
const useUnreadNotificationsCountMock = vi.fn();

vi.mock("@/features/auth/presentation/hooks/useAuth", () => ({
  useAuth: () => useAuthMock(),
}));

vi.mock("@/features/auth/presentation/hooks/useAuthProfileQuery", () => ({
  useAuthProfileQuery: () => useAuthProfileQueryMock(),
}));

vi.mock("@/features/notifications/presentation/hooks/useNotifications", () => ({
  useUnreadNotificationsCount: () => useUnreadNotificationsCountMock(),
}));

vi.mock("@/features/notifications/presentation/components/CustomerNotificationsPanel", () => ({
  default: () => <div>Notifications panel</div>,
}));

describe("CustomerTopBar", () => {
  beforeEach(() => {
    useAuthMock.mockReset();
    useAuthProfileQueryMock.mockReset();
    useUnreadNotificationsCountMock.mockReset();

    useAuthMock.mockReturnValue({
      logout: vi.fn(),
      user: { id: 7, role: "customer", roleId: 2 },
    });
    useAuthProfileQueryMock.mockReturnValue({
      data: {
        avatarUrl: null,
        fullName: "Cong ty Emerald",
        initials: "CE",
      },
    });
    useUnreadNotificationsCountMock.mockReturnValue({
      data: {
        totalUnread: 3,
      },
    });
  });

  it("opens notifications from the bell and does not render a notifications tab", () => {
    renderWithProviders(<CustomerTopBar />, {
      pathname: "/overview",
    });

    expect(screen.queryByRole("link", { name: "Thông báo" })).not.toBeInTheDocument();
    expect(screen.queryByText("Notifications panel")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Mở thông báo" }));

    expect(screen.getByText("Notifications panel")).toBeInTheDocument();
  });

  it("opens notifications automatically from the query string", () => {
    renderWithProviders(<CustomerTopBar />, {
      pathname: "/overview",
      searchParams: { notifications: "1" },
    });

    expect(screen.getByText("Notifications panel")).toBeInTheDocument();
  });
});
