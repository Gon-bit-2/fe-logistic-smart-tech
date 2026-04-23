import { screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { googleCallbackCopy } from "@/i18n/vi";
import { renderWithProviders } from "@/test/render";
import GoogleCallbackHandler from "./GoogleCallbackHandler";

const { exchangeGoogleSession, setAuthSessionTokens } = vi.hoisted(() => ({
  exchangeGoogleSession: vi.fn(),
  setAuthSessionTokens: vi.fn(),
}));

vi.mock("@/features/auth/infrastructure/api/auth.api", () => ({
  exchangeGoogleSession,
}));

vi.mock("@/features/auth/presentation/state/auth.store", async () => {
  const actual = await vi.importActual<object>("@/features/auth/presentation/state/auth.store");
  return {
    ...actual,
    setAuthSessionTokens,
  };
});

describe("GoogleCallbackHandler", () => {
  beforeEach(() => {
    exchangeGoogleSession.mockReset();
    setAuthSessionTokens.mockReset();
  });

  it("redeems the callback session and redirects to order creation", async () => {
    exchangeGoogleSession.mockResolvedValue({
      accessToken: "access-token",
    });

    const { router } = renderWithProviders(<GoogleCallbackHandler />, {
      searchParams: {
        sessionToken: "session-token",
      },
    });

    await waitFor(() => {
      expect(exchangeGoogleSession).toHaveBeenCalledWith("session-token");
      expect(setAuthSessionTokens).toHaveBeenCalledWith({
        accessToken: "access-token",
      });
      expect(router.replace).toHaveBeenCalledWith("/orders/create");
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
