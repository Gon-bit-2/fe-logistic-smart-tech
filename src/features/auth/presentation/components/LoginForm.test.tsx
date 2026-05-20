import { fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import viMessages from "@/messages/vi.json";
const loginFormCopy = viMessages.auth.loginForm;
import { renderWithProviders } from "@/test/render";
import LoginForm from "./LoginForm";

const googleLoginMutation = {
  mutate: vi.fn(),
  isPending: false,
  error: null as Error | null,
};

const loginMutation = {
  mutateAsync: vi.fn(),
  isPending: false,
  error: null as Error | null,
};

const requestOtpMutation = {
  mutateAsync: vi.fn(),
  isPending: false,
  error: null as Error | null,
};

vi.mock("@/features/auth/presentation/hooks/useGoogleLoginMutation", () => ({
  useGoogleLoginMutation: () => googleLoginMutation,
}));

vi.mock("@/features/auth/presentation/hooks/useLoginMutation", () => ({
  useLoginMutation: () => loginMutation,
}));

vi.mock("@/features/auth/presentation/hooks/useRequestRegisterOtpMutation", () => ({
  useRequestRegisterOtpMutation: () => requestOtpMutation,
}));

describe("LoginForm", () => {
  beforeEach(() => {
    googleLoginMutation.mutate.mockReset();
    googleLoginMutation.isPending = false;
    googleLoginMutation.error = null;
    loginMutation.mutateAsync.mockReset();
    loginMutation.isPending = false;
    loginMutation.error = null;
    requestOtpMutation.mutateAsync.mockReset();
    requestOtpMutation.isPending = false;
    requestOtpMutation.error = null;
  });

  it("submits login credentials and redirects to the operations workspace", async () => {
    loginMutation.mutateAsync.mockResolvedValue({
      accessToken: "access-token",
      profile: {
        avatarUrl: null,
        email: "ops@emerald.com",
        fullName: "Ops",
        hubId: null,
        id: 1,
        initials: "OP",
        phone: null,
        role: "customer",
        roleId: 2,
      },
    });

    const { router } = renderWithProviders(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText(loginFormCopy.emailPlaceholder), {
      target: { value: "ops@emerald.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(loginFormCopy.passwordPlaceholder), {
      target: { value: "Secret123" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: loginFormCopy.submitLogin }),
    );

    await waitFor(() => {
      expect(loginMutation.mutateAsync).toHaveBeenCalledWith({
        email: "ops@emerald.com",
        password: "Secret123",
      });
      expect(router.push).toHaveBeenCalledWith("/vi/dashboard");
    });
  });

  it("submits register details and redirects to OTP verification", async () => {
    requestOtpMutation.mutateAsync.mockResolvedValue(undefined);

    const { router } = renderWithProviders(<LoginForm mode="register" />);

    fireEvent.change(screen.getByPlaceholderText(loginFormCopy.fullNamePlaceholder), {
      target: { value: "Nguyen Van A" },
    });
    fireEvent.change(
      screen.getByPlaceholderText(loginFormCopy.organizationPlaceholder),
      {
        target: { value: "Emerald Ops" },
      },
    );
    fireEvent.change(screen.getByPlaceholderText(loginFormCopy.phonePlaceholder), {
      target: { value: "0909000000" },
    });
    fireEvent.change(screen.getByPlaceholderText(loginFormCopy.emailPlaceholder), {
      target: { value: "register@emerald.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(loginFormCopy.passwordPlaceholder), {
      target: { value: "Secret123" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: loginFormCopy.submitRegister }),
    );

    await waitFor(() => {
      expect(requestOtpMutation.mutateAsync).toHaveBeenCalledWith({
        email: "register@emerald.com",
        fullName: "Nguyen Van A",
        organization: "Emerald Ops",
        phone: "0909000000",
        password: "Secret123",
      });
      expect(router.push).toHaveBeenCalledWith("/vi/auth/otp?mode=register");
    });
  });

  it("renders API errors from the active login mutation", () => {
    loginMutation.error = new Error("Sai thông tin đăng nhập");

    renderWithProviders(<LoginForm />);

    expect(screen.getByText("Sai thông tin đăng nhập")).toBeInTheDocument();
  });
});
