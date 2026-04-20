import { screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { googleCallbackCopy } from "@/i18n/vi";
import { renderWithProviders } from "@/test/render";
import GoogleCallbackHandler from "./GoogleCallbackHandler";

const { setAuthSessionTokens } = vi.hoisted(() => ({
  setAuthSessionTokens: vi.fn(),
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
    setAuthSessionTokens.mockReset();
  });

  it("stores the returned tokens and redirects to order creation", async () => {
    const { router } = renderWithProviders(<GoogleCallbackHandler />, {
      searchParams: {
        accessToken: "access-token",
        refreshToken: "refresh-token",
      },
    });

    await waitFor(() => {
      expect(setAuthSessionTokens).toHaveBeenCalledWith({
        accessToken: "access-token",
        refreshToken: "refresh-token",
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
