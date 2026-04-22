"use client";

import Link from "next/link";
import { startTransition, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppIcon from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { useAuthSession } from "@/features/auth/presentation/hooks/useAuthSession";
import { useForgotPasswordMutation } from "@/features/auth/presentation/hooks/useForgotPasswordMutation";
import { useRegisterWithOtpMutation } from "@/features/auth/presentation/hooks/useRegisterWithOtpMutation";
import { useRequestForgotPasswordOtpMutation } from "@/features/auth/presentation/hooks/useRequestForgotPasswordOtpMutation";
import { useRequestRegisterOtpMutation } from "@/features/auth/presentation/hooks/useRequestRegisterOtpMutation";
import { otpVerificationCopy } from "@/i18n/vi";

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
  const [now, setNow] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const expiresAtMs = otpChallengeMeta
    ? new Date(otpChallengeMeta.expiresAt).getTime()
    : null;
  const secondsLeft = expiresAtMs
    ? now === null
      ? null
      : Math.max(0, Math.floor((expiresAtMs - now) / 1000))
    : 0;

  useEffect(() => {
    if (!otpChallengeMeta || !expiresAtMs) {
      return;
    }

    setNow(Date.now());

    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, [expiresAtMs, otpChallengeMeta]);

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
        setStatus(otpVerificationCopy.forgotPassword.successStatus);
      } else {
        await registerMutation.mutateAsync({ code });
        setStatus(otpVerificationCopy.register.successStatus);
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
                setStatus(otpVerificationCopy.forgotPassword.expiredStatus);
                return null;
              }

              return resendForgotPasswordOtpMutation.mutateAsync(pendingPasswordReset);
            })()
          : await (async () => {
              if (!pendingRegistration) {
                setStatus(otpVerificationCopy.register.expiredStatus);
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
      setStatus(
        otpMode === "forgot-password"
          ? otpVerificationCopy.forgotPassword.resendStatus(challenge.draft.email)
          : otpVerificationCopy.register.resendStatus(challenge.draft.email),
      );
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
            ? otpVerificationCopy.forgotPassword.title
            : otpVerificationCopy.register.title}
        </h1>
        <p className="leading-7 text-on-surface-variant">
          {otpMode === "forgot-password"
            ? otpVerificationCopy.forgotPassword.description(destination)
            : otpVerificationCopy.register.description(destination)}
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
              aria-label={otpVerificationCopy.ariaDigitLabel(index + 1)}
            />
          ))}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !pendingDraft}
          className="h-14 w-full bg-gradient-to-r from-primary to-primary-container text-base font-black text-white"
        >
          {isSubmitting
            ? otpVerificationCopy.verifyLoading
            : otpMode === "forgot-password"
              ? otpVerificationCopy.verifyReset
              : otpVerificationCopy.verifyComplete}
        </Button>
      </form>

      <div className="text-center text-sm text-on-surface-variant">
        Chưa nhận được mã?
        <button
          type="button"
          onClick={handleResend}
          disabled={(secondsLeft ?? 0) > 0 || resendMutation.isPending || !pendingDraft}
          className="ml-2 inline-flex items-center gap-2 font-black text-primary disabled:text-outline"
        >
          {otpVerificationCopy.resendLabel}
          <span className="rounded-full bg-surface-container-high px-2 py-0.5 text-[10px] font-black tracking-[0.08em] text-on-surface-variant uppercase">
            00:{secondsLeft === null ? "--" : secondsLeft.toString().padStart(2, "0")}
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
        <AppIcon name="info" className="text-secondary" />
        <div>
          <p className="font-semibold text-on-surface">{otpVerificationCopy.infoTitle}</p>
          <p className="mt-1 text-sm text-on-surface-variant">
            {otpMode === "forgot-password"
              ? otpVerificationCopy.forgotPassword.help
              : otpVerificationCopy.register.help}
          </p>
        </div>
      </div>

      <footer className="flex items-center justify-between border-t border-outline-variant/10 pt-8 text-sm">
        <div className="flex gap-6 text-on-surface-variant">
          <Link href="/tracking" className="hover:text-primary">
            {otpVerificationCopy.footerSupport}
          </Link>
          <Link href="/auth/login" className="hover:text-primary">
            {otpVerificationCopy.footerPrivacy}
          </Link>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.16em] text-on-surface-variant uppercase">
          <AppIcon name="lock" className="text-sm" />
          {otpVerificationCopy.footerSecureSession}
        </div>
      </footer>
    </div>
  );
}
