import { screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { googleCallbackCopy } from "@/i18n/vi";
import { renderWithProviders } from "@/test/render";
import GoogleCallbackHandler from "./GoogleCallbackHandler";

const { exchangeGoogleSession, setAuthSession } = vi.hoisted(() => ({
  exchangeGoogleSession: vi.fn(),
  setAuthSession: vi.fn(),
}));

vi.mock("@/features/auth/infrastructure/api/auth.api", () => ({
  exchangeGoogleSession,
}));

vi.mock("@/features/auth/presentation/state/auth.store", async () => {
  const actual = await vi.importActual<object>("@/features/auth/presentation/state/auth.store");
  return {
    ...actual,
    setAuthSession,
  };
});

describe("GoogleCallbackHandler", () => {
  beforeEach(() => {
    exchangeGoogleSession.mockReset();
    setAuthSession.mockReset();
  });

  it("redeems the callback session and redirects to dashboard", async () => {
    exchangeGoogleSession.mockResolvedValue({
      accessToken: "access-token",
      profile: {
        avatarUrl: null,
        email: "customer@emerald.com",
        fullName: "Customer",
        hubId: null,
        id: 1,
        initials: "CU",
        phone: null,
        role: "customer",
        roleId: 2,
      },
    });

    const { router } = renderWithProviders(<GoogleCallbackHandler />, {
      searchParams: {
        sessionToken: "session-token",
      },
    });

    await waitFor(() => {
      expect(exchangeGoogleSession).toHaveBeenCalledWith("session-token");
      expect(setAuthSession).toHaveBeenCalledWith({
        accessToken: "access-token",
        profile: {
          avatarUrl: null,
          email: "customer@emerald.com",
          fullName: "Customer",
          hubId: null,
          id: 1,
          initials: "CU",
          phone: null,
          role: "customer",
          roleId: 2,
        },
      });
      expect(router.replace).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("renders the error state when the callback is incomplete", () => {
    renderWithProviders(<GoogleCallbackHandler />, {
      searchParams: {
        errorMessage: "Đăng nhập bị từ chối",
      },
    });

    expect(screen.getByText(googleCallbackCopy.errorTitle)).toBeInTheDocument();
    expect(screen.getByText("Đăng nhập bị từ chối")).toBeInTheDocument();
  });
});
