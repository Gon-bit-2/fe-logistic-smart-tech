"use client";

import type {
  AuthCredentials,
  OtpChallenge,
  OtpVerificationInput,
} from "@/features/auth/types/auth.types";
import { useAuthStore } from "@/store/useAuthStore";

function maskDestination(email: string) {
  const [local, domain] = email.split("@");
  const visible = local.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(local.length - 2, 2))}@${domain}`;
}

export function useAuth() {
  const auth = useAuthStore();

  async function login(credentials: AuthCredentials) {
    const user = {
      id: `user-${Date.now()}`,
      name: credentials.name ?? credentials.email.split("@")[0],
      email: credentials.email,
      role: credentials.role ?? "customer",
    } as const;

    auth.setSession({
      token: `demo-token-${Date.now()}`,
      user,
      otpChallenge: null,
      pendingRegistration: null,
    });

    return user;
  }

  async function requestOtpChallenge(credentials: AuthCredentials) {
    const challenge: OtpChallenge = {
      id: `otp-${Date.now()}`,
      destination: credentials.email,
      maskedDestination: maskDestination(credentials.email),
      channel: "email",
      expiresAt: new Date(Date.now() + 60 * 1000).toISOString(),
    };

    auth.setOtpChallenge(challenge, credentials);
    return challenge;
  }

  async function resendOtpChallenge() {
    const pending = auth.pendingRegistration;

    if (!pending) {
      throw new Error("No pending registration found.");
    }

    return requestOtpChallenge(pending);
  }

  async function verifyOtpChallenge(input: OtpVerificationInput) {
    if (input.code.trim().length !== 6) {
      throw new Error("OTP code must contain 6 digits.");
    }

    if (auth.otpChallenge && auth.otpChallenge.id !== input.challengeId) {
      throw new Error("OTP challenge is no longer valid.");
    }

    const registration = auth.pendingRegistration ?? {
      email: auth.otpChallenge?.destination ?? "customer@emerald-logistics.com",
      password: "demo-password",
      name: "Customer Operator",
      organization: "Emerald Logistics Workspace",
      role: "customer" as const,
    };

    const user = await login({
      ...registration,
      role: registration.role ?? "customer",
    });

    return user;
  }

  return {
    ...auth,
    login,
    requestOtpChallenge,
    resendOtpChallenge,
    verifyOtpChallenge,
    logout: auth.clearSession,
  };
}
