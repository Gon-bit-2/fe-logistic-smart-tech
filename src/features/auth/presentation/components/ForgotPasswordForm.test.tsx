import { fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import viMessages from "@/messages/vi.json";
const forgotPasswordCopy = viMessages.auth.forgotPassword;
import { renderWithProviders } from "@/test/render";
import ForgotPasswordForm from "./ForgotPasswordForm";

const requestOtpMutation = {
  mutateAsync: vi.fn(),
  isPending: false,
  error: null as Error | null,
};

vi.mock("@/features/auth/presentation/hooks/useRequestForgotPasswordOtpMutation", () => ({
  useRequestForgotPasswordOtpMutation: () => requestOtpMutation,
}));

describe("ForgotPasswordForm", () => {
  beforeEach(() => {
    requestOtpMutation.mutateAsync.mockReset();
    requestOtpMutation.isPending = false;
    requestOtpMutation.error = null;
  });

  it("requests a reset OTP and redirects to the OTP verification page", async () => {
    requestOtpMutation.mutateAsync.mockResolvedValue(undefined);

    const { router } = renderWithProviders(<ForgotPasswordForm />);

    fireEvent.change(screen.getByPlaceholderText(forgotPasswordCopy.emailPlaceholder), {
      target: { value: "ops@emerald.com" },
    });
    fireEvent.change(screen.getAllByPlaceholderText(forgotPasswordCopy.passwordPlaceholder)[0], {
      target: { value: "Secret123" },
    });
    fireEvent.change(screen.getAllByPlaceholderText(forgotPasswordCopy.passwordPlaceholder)[1], {
      target: { value: "Secret123" },
    });
    fireEvent.click(screen.getByRole("button", { name: forgotPasswordCopy.submit }));

    await waitFor(() => {
      expect(requestOtpMutation.mutateAsync).toHaveBeenCalledWith({
        email: "ops@emerald.com",
        password: "Secret123",
        confirmPassword: "Secret123",
      });
      expect(router.push).toHaveBeenCalledWith("/auth/otp?mode=forgot-password");
    });
  });

  it("renders mutation errors when the reset request fails", () => {
    requestOtpMutation.error = new Error("Không thể gửi OTP");

    renderWithProviders(<ForgotPasswordForm />);

    expect(screen.getByText("Không thể gửi OTP")).toBeInTheDocument();
  });
});
