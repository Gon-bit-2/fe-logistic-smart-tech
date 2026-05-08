"use client";

import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProfileQuickAccess from "@/features/profile/presentation/components/ProfileQuickAccess";
import { renderWithProviders } from "@/test/render";

const useAuthSessionMock = vi.fn();
const useAuthProfileQueryMock = vi.fn();

vi.mock("@/features/auth/presentation/hooks/useAuthSession", () => ({
  useAuthSession: () => useAuthSessionMock(),
}));

vi.mock("@/features/auth/presentation/hooks/useAuthProfileQuery", () => ({
  useAuthProfileQuery: () => useAuthProfileQueryMock(),
}));

describe("ProfileQuickAccess", () => {
  beforeEach(() => {
    useAuthSessionMock.mockReset();
    useAuthProfileQueryMock.mockReset();
  });

  function mockAuthenticatedCustomer() {
    useAuthSessionMock.mockReturnValue({
      isAuthenticated: true,
      user: { id: 7, role: "customer", roleId: 2 },
    });
    useAuthProfileQueryMock.mockReturnValue({
      data: {
        avatarUrl: null,
        email: "customer@emerald.vn",
        fullName: "Cong ty Emerald",
        initials: "CE",
      },
    });
  }

  it("hides on landing page", () => {
    mockAuthenticatedCustomer();

    renderWithProviders(<ProfileQuickAccess />, { pathname: "/" });

    expect(
      screen.queryByLabelText("Mở hồ sơ người dùng"),
    ).not.toBeInTheDocument();
  });

  it("hides on customer workspace routes that already have a top bar", () => {
    mockAuthenticatedCustomer();

    renderWithProviders(<ProfileQuickAccess />, {
      pathname: "/orders",
    });

    expect(
      screen.queryByLabelText("Mở hồ sơ người dùng"),
    ).not.toBeInTheDocument();
  });

  it("shows the profile link on other authenticated pages", () => {
    mockAuthenticatedCustomer();

    renderWithProviders(<ProfileQuickAccess />, {
      pathname: "/checkout",
    });

    expect(screen.getByLabelText("Mở hồ sơ người dùng")).toHaveAttribute(
      "href",
      "/profile",
    );
    expect(screen.getByText("Cong ty Emerald")).toBeInTheDocument();
  });
});
