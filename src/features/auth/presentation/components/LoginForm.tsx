"use client";

import { Link } from "@/i18n/routing";
import { startTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import AppIcon from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useGoogleLoginMutation } from "@/features/auth/presentation/hooks/useGoogleLoginMutation";
import { useLoginMutation } from "@/features/auth/presentation/hooks/useLoginMutation";
import { useRequestRegisterOtpMutation } from "@/features/auth/presentation/hooks/useRequestRegisterOtpMutation";
import type { AuthFormMode } from "@/features/auth/domain/types/auth.types";
import { localizePath, type Locale } from "@/i18n/config";

type LoginFormProps = {
  mode?: AuthFormMode;
};

const authInputClass =
  "h-12 rounded-xl border-b border-outline-variant/30 px-4 py-3 focus:px-4 focus:rounded-xl";

export default function LoginForm({ mode = "login" }: LoginFormProps) {
  const tLoginForm = useTranslations("auth.loginForm");
  const isRegister = mode === "register";
  const router = useRouter();
  const locale = useLocale() as Locale;
  const googleLoginMutation = useGoogleLoginMutation();
  const loginMutation = useLoginMutation();
  const requestOtpMutation = useRequestRegisterOtpMutation();
  const [status, setStatus] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    organization: "",
    phone: "",
    email: "",
    password: "",
    persist: true,
  });
  const activeError = isRegister ? requestOtpMutation.error : loginMutation.error;
  const isSubmitting = isRegister
    ? requestOtpMutation.isPending
    : loginMutation.isPending;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    try {
      if (isRegister) {
        await requestOtpMutation.mutateAsync({
          email: form.email,
          fullName: form.fullName,
          organization: form.organization,
          phone: form.phone,
          password: form.password,
        });

        setStatus(tLoginForm("registerSuccessStatus"));
        startTransition(() => {
          router.push(`${localizePath("/auth/otp", locale)}?mode=register`);
        });
        return;
      }

      await loginMutation.mutateAsync({
        email: form.email,
        password: form.password,
      });

      setStatus(tLoginForm("loginSuccessStatus"));
      startTransition(() => {
        router.push(localizePath("/dashboard", locale));
      });
    } catch {
      // Allow react-query error boundaries to handle this, or let it fail silently as UI handles it
      return;
    }
  }

  // Define static google options equivalent since we can't map translations easily via a list if it's dynamic
  // Though originally it was `loginFormCopy.googleOptions.map`
  const rawGoogleOptions = tLoginForm.raw("googleOptions") as { label: string }[];
  const googleOptions = [
    { label: rawGoogleOptions[0].label, icon: "google" as const },
    { label: rawGoogleOptions[1].label, icon: "github" as const },
    { label: rawGoogleOptions[2].label, icon: "microsoft" as const }
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-on-surface sm:text-4xl">
          {tLoginForm("headerTitle")}
        </h1>
        <p className="text-sm leading-6 text-on-surface-variant">
          {tLoginForm("headerDescription")}
        </p>
      </header>

      <div className="flex flex-wrap gap-5 border-b border-outline-variant/20 sm:gap-8">
        <Link
          href="/auth/login"
          className={`pb-4 text-xs font-black tracking-[0.14em] uppercase transition-colors sm:text-sm ${
            isRegister
              ? "text-outline hover:text-primary"
              : "border-b-2 border-primary text-primary"
          }`}
        >
          {tLoginForm("loginLabel")}
        </Link>
        <Link
          href="/auth/register"
          className={`pb-4 text-xs font-black tracking-[0.14em] uppercase transition-colors sm:text-sm ${
            isRegister
              ? "border-b-2 border-primary text-primary"
              : "text-outline hover:text-primary"
          }`}
        >
          {tLoginForm("registerLabel")}
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        {isRegister ? (
          <>
            <label className="block space-y-2">
              <span className="px-1 text-[10px] font-black tracking-[0.16em] text-outline uppercase">
                {tLoginForm("fullNameLabel")}
              </span>
              <Input
                value={form.fullName}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    fullName: event.target.value,
                  }))
                }
                className={authInputClass}
                placeholder={tLoginForm("fullNamePlaceholder")}
              />
            </label>

            <label className="block space-y-2">
              <span className="px-1 text-[10px] font-black tracking-[0.16em] text-outline uppercase">
                {tLoginForm("organizationLabel")}
              </span>
              <Input
                value={form.organization}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    organization: event.target.value,
                  }))
                }
                className={authInputClass}
                placeholder={tLoginForm("organizationPlaceholder")}
              />
            </label>

            <label className="block space-y-2">
              <span className="px-1 text-[10px] font-black tracking-[0.16em] text-outline uppercase">
                {tLoginForm("phoneLabel")}
              </span>
              <Input
                value={form.phone}
                onChange={(event) =>
                  setForm((current) => ({ ...current, phone: event.target.value }))
                }
                className={authInputClass}
                placeholder={tLoginForm("phonePlaceholder")}
              />
            </label>
          </>
        ) : null}

        <label className="block space-y-2">
          <span className="px-1 text-[10px] font-black tracking-[0.16em] text-outline uppercase">
            {tLoginForm("emailLabel")}
          </span>
          <Input
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
            className={authInputClass}
            placeholder={tLoginForm("emailPlaceholder")}
            type="email"
          />
        </label>

        <div className="block space-y-2">
          <div className="flex flex-col items-start gap-2 px-1 sm:flex-row sm:items-end sm:justify-between">
            <label htmlFor="password-input" className="text-[10px] font-black tracking-[0.16em] text-outline uppercase cursor-pointer">
              {tLoginForm("passwordLabel")}
            </label>
            {!isRegister ? (
              <span className="text-[10px] font-black tracking-[0.16em] text-tertiary uppercase">
                <Link href="/auth/forgot-password">{tLoginForm("forgotKeyLabel")}</Link>
              </span>
            ) : null}
          </div>
          <Input
            id="password-input"
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({ ...current, password: event.target.value }))
            }
            className={authInputClass}
            placeholder={tLoginForm("passwordPlaceholder")}
            type="password"
          />
        </div>

        <label className="flex items-center gap-3 pt-1">
          <input
            checked={form.persist}
            onChange={(event) =>
              setForm((current) => ({ ...current, persist: event.target.checked }))
            }
            className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/25"
            type="checkbox"
          />
          <span className="text-sm text-on-surface-variant">
            {tLoginForm("activeSessionLabel")}
          </span>
        </label>

        <Button
          className="h-14 w-full bg-gradient-to-br from-primary to-primary-container text-base font-black tracking-wide text-white shadow-[0_18px_30px_-18px_rgba(6,78,59,0.45)]"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting
            ? tLoginForm("submitLoading")
            : isRegister
              ? tLoginForm("submitRegister")
              : tLoginForm("submitLogin")}
        </Button>
      </form>

      {status ? (
        <div className="rounded-xl bg-primary/8 px-4 py-3 text-sm text-on-surface">
          {status}
        </div>
      ) : null}

      {activeError ? (
        <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {activeError.message}
        </div>
      ) : null}

      {googleLoginMutation.error ? (
        <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {googleLoginMutation.error.message}
        </div>
      ) : null}

      <div className="relative">
        <Separator />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-surface-container-lowest px-4 text-[10px] font-black tracking-[0.16em] text-outline uppercase">
            {tLoginForm("orEnterWith")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {googleOptions.map((item) => (
          <button
            key={item.label}
            type="button"
            disabled={
              item.label !== googleOptions[0].label ||
              googleLoginMutation.isPending ||
              isSubmitting
            }
            onClick={() => {
              if (item.label === googleOptions[0].label) {
                setStatus(null);
                googleLoginMutation.mutate();
              }
            }}
            className="min-h-24 rounded-xl border border-outline-variant/12 px-3 py-4 text-center transition hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-50"
          >
            <AppIcon name={item.icon} className="text-on-surface-variant" />
            <div className="mt-2 text-[10px] font-black tracking-[0.08em] text-outline uppercase">
              {item.label === googleOptions[0].label &&
              googleLoginMutation.isPending
                ? tLoginForm("connectGoogleLabel")
                : item.label}
            </div>
          </button>
        ))}
      </div>

      <footer className="space-y-5 pt-4">
        <p className="text-center text-[10px] font-medium tracking-[0.14em] text-outline-variant uppercase">
          {tLoginForm("footerCopyright")}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[10px] font-black tracking-[0.16em] text-outline uppercase">
          <Link href="/auth/login">{tLoginForm("privacyLabel")}</Link>
          <Link href="/auth/register">{tLoginForm("apiDocsLabel")}</Link>
          <Link href="/tracking">{tLoginForm("supportLabel")}</Link>
        </div>
      </footer>
    </div>
  );
}
