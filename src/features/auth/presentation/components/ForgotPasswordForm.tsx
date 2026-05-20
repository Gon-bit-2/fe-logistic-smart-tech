"use client";

import { Link } from "@/i18n/routing";
import { startTransition, type FormEvent, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRequestForgotPasswordOtpMutation } from "@/features/auth/presentation/hooks/useRequestForgotPasswordOtpMutation";
import { useTranslations } from "next-intl";

const authInputClass =
  "h-12 rounded-xl border-b border-outline-variant/30 px-4 py-3 focus:px-4 focus:rounded-xl";

export default function ForgotPasswordForm() {
  const tForgot = useTranslations("auth.forgotPassword");
  const router = useRouter();
  const requestOtpMutation = useRequestForgotPasswordOtpMutation();
  const [status, setStatus] = useState<string | null>(null);
  const [form, setForm] = useState({
    confirmPassword: "",
    email: "",
    password: "",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    try {
      await requestOtpMutation.mutateAsync(form);
      setStatus(tForgot("status"));
      startTransition(() => {
        router.push("/auth/otp?mode=forgot-password");
      });
    } catch {
      return;
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-on-surface sm:text-4xl">
          {tForgot("headerTitle")}
        </h1>
        <p className="text-sm leading-6 text-on-surface-variant">
          {tForgot("headerDescription")}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        <label className="block space-y-2">
          <span className="px-1 text-[10px] font-black tracking-[0.16em] text-outline uppercase">
            {tForgot("emailLabel")}
          </span>
          <Input
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
            className={authInputClass}
            placeholder={tForgot("emailPlaceholder")}
            type="email"
          />
        </label>

        <label className="block space-y-2">
          <span className="px-1 text-[10px] font-black tracking-[0.16em] text-outline uppercase">
            {tForgot("newPasswordLabel")}
          </span>
          <Input
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({ ...current, password: event.target.value }))
            }
            className={authInputClass}
            placeholder={tForgot("passwordPlaceholder")}
            type="password"
          />
        </label>

        <label className="block space-y-2">
          <span className="px-1 text-[10px] font-black tracking-[0.16em] text-outline uppercase">
            {tForgot("confirmPasswordLabel")}
          </span>
          <Input
            value={form.confirmPassword}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                confirmPassword: event.target.value,
              }))
            }
            className={authInputClass}
            placeholder={tForgot("passwordPlaceholder")}
            type="password"
          />
        </label>

        <Button
          className="h-14 w-full bg-gradient-to-br from-primary to-primary-container text-base font-black tracking-wide text-white shadow-[0_18px_30px_-18px_rgba(6,78,59,0.45)]"
          disabled={requestOtpMutation.isPending}
          type="submit"
        >
          {requestOtpMutation.isPending
            ? tForgot("submitLoading")
            : tForgot("submit")}
        </Button>
      </form>

      {status ? (
        <div className="rounded-xl bg-primary/8 px-4 py-3 text-sm text-on-surface">
          {status}
        </div>
      ) : null}

      {requestOtpMutation.error ? (
        <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {requestOtpMutation.error.message}
        </div>
      ) : null}

      <footer className="flex flex-col gap-3 border-t border-outline-variant/10 pt-6 text-center text-sm text-on-surface-variant sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <Link href="/auth/login" className="font-semibold text-primary">
          {tForgot("backToLoginLabel")}
        </Link>
        <Link href="/tracking" className="font-semibold">
          {tForgot("supportLabel")}
        </Link>
      </footer>
    </div>
  );
}
