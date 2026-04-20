import { describe, expect, it, vi } from "vitest";
import {
  buildOtpChallenge,
  parseGoogleCallbackParams,
  toForgotPasswordDraft,
  toRegisterDraft,
} from "./auth.utils";

describe("auth.utils", () => {
  it("builds an OTP challenge with a masked email and one-minute expiry", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-19T08:00:00.000Z"));

    const challenge = buildOtpChallenge("operator@emerald.com", "REGISTER");

    expect(challenge.maskedDestination).toBe("op******@emerald.com");
    expect(challenge.expiresAt).toBe("2026-04-19T08:01:00.000Z");
    expect(challenge.type).toBe("REGISTER");

    vi.useRealTimers();
  });

  it("normalizes register drafts by trimming optional fields", () => {
    expect(
      toRegisterDraft({
        email: "  ops@emerald.com ",
        fullName: "  Nguyen Van A ",
        organization: "  Emerald Ops ",
        password: "Secret123",
        phone: " 0909000000 ",
      }),
    ).toEqual({
      email: "ops@emerald.com",
      fullName: "Nguyen Van A",
      organization: "Emerald Ops",
      password: "Secret123",
      phone: "0909000000",
    });
  });

  it("normalizes forgot-password drafts by trimming email only", () => {
    expect(
      toForgotPasswordDraft({
        email: "  ops@emerald.com ",
        password: "Secret123",
        confirmPassword: "Secret123",
      }),
    ).toEqual({
      email: "ops@emerald.com",
      password: "Secret123",
      confirmPassword: "Secret123",
    });
  });

  it("parses Google callback params from URL search params", () => {
    const params = new URLSearchParams({
      accessToken: "access",
      refreshToken: "refresh",
      errorMessage: "blocked",
    });

    expect(parseGoogleCallbackParams(params)).toEqual({
      accessToken: "access",
      refreshToken: "refresh",
      errorMessage: "blocked",
    });
  });
});
