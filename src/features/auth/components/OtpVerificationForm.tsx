"use client";

import Link from "next/link";
import { startTransition, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthSession } from "@/features/auth/hooks/useAuthSession";
import { useForgotPasswordMutation } from "@/features/auth/hooks/useForgotPasswordMutation";
import { useRegisterWithOtpMutation } from "@/features/auth/hooks/useRegisterWithOtpMutation";
import { useRequestForgotPasswordOtpMutation } from "@/features/auth/hooks/useRequestForgotPasswordOtpMutation";
import { useRequestRegisterOtpMutation } from "@/features/auth/hooks/useRequestRegisterOtpMutation";

const OTP_LENGTH = 6;

function getInitialDigits() {
  return Array.from({ length: OTP_LENGTH }, () => "");
}

export default function OtpVerificationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const otpMode =
    searchParams.get("mode") === "forgot-password"
      ? "forgot-password"
      : "register";
  const { otpChallengeMeta, pendingPasswordReset, pendingRegistration } =
    useAuthSession();
  const forgotPasswordMutation = useForgotPasswordMutation();
  const registerMutation = useRegisterWithOtpMutation();
  const resendForgotPasswordOtpMutation = useRequestForgotPasswordOtpMutation();
  const resendOtpMutation = useRequestRegisterOtpMutation();
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [digits, setDigits] = useState<string[]>(getInitialDigits);
  const [now, setNow] = useState(() => Date.now());
  const [status, setStatus] = useState<string | null>(null);
  const expiresAtMs = otpChallengeMeta
    ? new Date(otpChallengeMeta.expiresAt).getTime()
    : null;
  const secondsLeft = expiresAtMs
    ? Math.max(0, Math.floor((expiresAtMs - now) / 1000))
    : 0;

  useEffect(() => {
    if (!otpChallengeMeta || secondsLeft <= 0) {
      return;
    }

    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, [otpChallengeMeta, secondsLeft]);

  function setDigit(index: number, value: string) {
    const nextValue = value.replace(/\D/g, "").slice(-1);

    setDigits((current) => {
      const nextDigits = [...current];
      nextDigits[index] = nextValue;
      return nextDigits;
    });

    if (nextValue && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    try {
      const code = digits.join("");
      if (otpMode === "forgot-password") {
        await forgotPasswordMutation.mutateAsync({ code });
        setStatus("Password updated. Redirecting to login...");
      } else {
        await registerMutation.mutateAsync({ code });
        setStatus("Verification successful. Redirecting to login...");
      }

      startTransition(() => {
        router.push("/auth/login");
      });
    } catch {
      return;
    }
  }

  async function handleResend() {
    try {
      const challenge =
        otpMode === "forgot-password"
          ? await (async () => {
              if (!pendingPasswordReset) {
                setStatus("Password reset session expired. Please request a new OTP.");
                return null;
              }

              return resendForgotPasswordOtpMutation.mutateAsync(pendingPasswordReset);
            })()
          : await (async () => {
              if (!pendingRegistration) {
                setStatus("Registration session expired. Please request a new OTP.");
                return null;
              }

              return resendOtpMutation.mutateAsync(pendingRegistration);
            })();

      if (!challenge) {
        return;
      }

      setNow(Date.now());
      setDigits(getInitialDigits());
      inputRefs.current[0]?.focus();
      setStatus(`A new code has been sent to ${challenge.draft.email}.`);
    } catch {
      return;
    }
  }

  const pendingDraft =
    otpMode === "forgot-password" ? pendingPasswordReset : pendingRegistration;
  const destination =
    otpChallengeMeta?.maskedDestination ?? "cu******@emerald-logistics.com";
  const activeError =
    registerMutation.error ??
    forgotPasswordMutation.error ??
    resendForgotPasswordOtpMutation.error ??
    resendOtpMutation.error;
  const isSubmitting =
    registerMutation.isPending || forgotPasswordMutation.isPending;
  const resendMutation =
    otpMode === "forgot-password"
      ? resendForgotPasswordOtpMutation
      : resendOtpMutation;

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-4xl font-black tracking-tight text-on-surface">
          {otpMode === "forgot-password"
            ? "Reset Password Verification"
            : "Security Verification"}
        </h1>
        <p className="leading-7 text-on-surface-variant">
          {otpMode === "forgot-password"
            ? `We've sent a 6-digit code to ${destination}. Enter it below to confirm your password reset.`
            : `We've sent a 6-digit code to ${destination}. Enter it below to complete your workspace registration.`}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex justify-between gap-2 md:gap-4">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              value={digit}
              onChange={(event) => setDigit(index, event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Backspace" && !digits[index] && index > 0) {
                  inputRefs.current[index - 1]?.focus();
                }
              }}
              inputMode="numeric"
              maxLength={1}
              className="h-16 w-12 rounded-xl border-b-2 border-outline-variant bg-transparent text-center text-2xl font-black text-primary outline-none transition focus:border-primary focus:bg-surface-container-low focus:ring-4 focus:ring-primary/10 md:w-14"
              aria-label={`OTP digit ${index + 1}`}
            />
          ))}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !pendingDraft}
          className="h-14 w-full bg-gradient-to-r from-primary to-primary-container text-base font-black text-white"
        >
          {isSubmitting
            ? "Verifying..."
            : otpMode === "forgot-password"
              ? "Verify & Reset Password"
              : "Verify & Complete"}
        </Button>
      </form>

      <div className="text-center text-sm text-on-surface-variant">
        Didn&apos;t receive the code?
        <button
          type="button"
          onClick={handleResend}
          disabled={secondsLeft > 0 || resendMutation.isPending || !pendingDraft}
          className="ml-2 inline-flex items-center gap-2 font-black text-primary disabled:text-outline"
        >
          Resend Code
          <span className="rounded-full bg-surface-container-high px-2 py-0.5 text-[10px] font-black tracking-[0.08em] text-on-surface-variant uppercase">
            00:{secondsLeft.toString().padStart(2, "0")}
          </span>
        </button>
      </div>

      {status ? (
        <div className="rounded-xl bg-surface-container p-4 text-sm text-on-surface">
          {status}
        </div>
      ) : null}

      {activeError ? (
        <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">
          {activeError.message}
        </div>
      ) : null}

      <div className="flex items-start gap-4 rounded-xl border border-outline-variant/10 bg-surface-container p-5">
        <span className="material-symbols-outlined text-secondary">info</span>
        <div>
          <p className="font-semibold text-on-surface">Having trouble?</p>
          <p className="mt-1 text-sm text-on-surface-variant">
            {otpMode === "forgot-password"
              ? "Check spam folders or confirm the email address used for the password reset request."
              : "Check spam folders or confirm the contact details used during registration."}
          </p>
        </div>
      </div>

      <footer className="flex items-center justify-between border-t border-outline-variant/10 pt-8 text-sm">
        <div className="flex gap-6 text-on-surface-variant">
          <Link href="/tracking" className="hover:text-primary">
            Support
          </Link>
          <Link href="/auth/login" className="hover:text-primary">
            Privacy Policy
          </Link>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.16em] text-on-surface-variant uppercase">
          <span className="material-symbols-outlined text-sm">lock</span>
          Secure Session
        </div>
      </footer>
    </div>
  );
}
