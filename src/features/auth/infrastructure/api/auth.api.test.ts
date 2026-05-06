import { beforeEach, describe, expect, it, vi } from "vitest";
import { forgotPassword } from "@/features/auth/infrastructure/api/auth.api";
import { httpClient } from "@/lib/api/http-client";

vi.mock("@/lib/api/http-client", () => ({
  httpClient: {
    post: vi.fn(),
  },
}));

const post = vi.mocked(httpClient.post);

describe("auth.api", () => {
  beforeEach(() => {
    post.mockReset();
  });

  it("maps forgot password draft fields to the backend reset password contract", async () => {
    post.mockResolvedValue({
      data: {
        message: "Password reset",
      },
    });

    await expect(
      forgotPassword({
        code: "123456",
        confirmPassword: "Secret123",
        email: "ops@emerald.com",
        password: "Secret123",
      }),
    ).resolves.toEqual({
      message: "Password reset",
    });

    expect(post).toHaveBeenCalledWith("/auth/forgot-password", {
      code: "123456",
      confirmNewPassword: "Secret123",
      email: "ops@emerald.com",
      newPassword: "Secret123",
    });
  });
});
