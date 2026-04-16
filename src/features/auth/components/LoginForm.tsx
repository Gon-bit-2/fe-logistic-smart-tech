"use client";

import Link from "next/link";
import { startTransition } from "react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useGoogleLoginMutation } from "@/features/auth/hooks/useGoogleLoginMutation";
import { useLoginMutation } from "@/features/auth/hooks/useLoginMutation";
import { useRequestRegisterOtpMutation } from "@/features/auth/hooks/useRequestRegisterOtpMutation";
import type { AuthFormMode } from "@/features/auth/types/auth.types";

type LoginFormProps = {
  mode?: AuthFormMode;
};

export default function LoginForm({ mode = "login" }: LoginFormProps) {
  const isRegister = mode === "register";
  const router = useRouter();
  const googleLoginMutation = useGoogleLoginMutation();
  const loginMutation = useLoginMutation();
  const requestOtpMutation = useRequestRegisterOtpMutation();
  const [status, setStatus] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "Marcus Thorne",
    organization: "Sustainable Goods Co.",
    phone: "+45 000 111 222",
    email: isRegister ? "planner@emerald-logistics.com" : "ops@emerald-logistics.com",
    password: "demo-password",
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

        setStatus("Verification code sent. Continue to OTP confirmation.");
        startTransition(() => {
          router.push("/auth/otp?mode=register");
        });
        return;
      }

      await loginMutation.mutateAsync({
        email: form.email,
        password: form.password,
      });

      setStatus("Session established. Redirecting to operations workspace...");
      startTransition(() => {
        router.push("/orders/create");
      });
    } catch {
      return;
    }
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-on-surface">
          Welcome to Emerald Logistics
        </h1>
        <p className="text-sm leading-6 text-on-surface-variant">
          Access your precision logistics dashboard and move through the customer
          checkout flow with production-ready structure.
        </p>
      </header>

      <div className="flex gap-8 border-b border-outline-variant/20">
        <Link
          href="/auth/login"
          className={`pb-4 text-sm font-black tracking-[0.14em] uppercase transition-colors ${
            isRegister
              ? "text-outline hover:text-primary"
              : "border-b-2 border-primary text-primary"
          }`}
        >
          Login
        </Link>
        <Link
          href="/auth/register"
          className={`pb-4 text-sm font-black tracking-[0.14em] uppercase transition-colors ${
            isRegister
              ? "border-b-2 border-primary text-primary"
              : "text-outline hover:text-primary"
          }`}
        >
          Register
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {isRegister ? (
          <>
            <label className="block space-y-2">
              <span className="px-1 text-[10px] font-black tracking-[0.16em] text-outline uppercase">
                Full name
              </span>
              <Input
                value={form.fullName}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    fullName: event.target.value,
                  }))
                }
                className="border-b border-outline-variant/30 pb-3 focus:rounded-lg"
                placeholder="Marcus Thorne"
              />
            </label>

            <label className="block space-y-2">
              <span className="px-1 text-[10px] font-black tracking-[0.16em] text-outline uppercase">
                Organization
              </span>
              <Input
                value={form.organization}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    organization: event.target.value,
                  }))
                }
                className="border-b border-outline-variant/30 pb-3 focus:rounded-lg"
                placeholder="Sustainable Goods Co."
              />
            </label>

            <label className="block space-y-2">
              <span className="px-1 text-[10px] font-black tracking-[0.16em] text-outline uppercase">
                Contact number
              </span>
              <Input
                value={form.phone}
                onChange={(event) =>
                  setForm((current) => ({ ...current, phone: event.target.value }))
                }
                className="border-b border-outline-variant/30 pb-3 focus:rounded-lg"
                placeholder="+45 000 111 222"
              />
            </label>
          </>
        ) : null}

        <label className="block space-y-2">
          <span className="px-1 text-[10px] font-black tracking-[0.16em] text-outline uppercase">
            Organization email
          </span>
          <Input
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
            className="border-b border-outline-variant/30 pb-3 focus:rounded-lg"
            placeholder="name@precision-stream.com"
            type="email"
          />
        </label>

        <label className="block space-y-2">
          <div className="flex items-end justify-between gap-3 px-1">
            <span className="text-[10px] font-black tracking-[0.16em] text-outline uppercase">
              Security key
            </span>
            {!isRegister ? (
              <span className="text-[10px] font-black tracking-[0.16em] text-tertiary uppercase">
                <Link href="/auth/forgot-password">Forgot key?</Link>
              </span>
            ) : null}
          </div>
          <Input
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({ ...current, password: event.target.value }))
            }
            className="border-b border-outline-variant/30 pb-3 focus:rounded-lg"
            placeholder="••••••••••••"
            type="password"
          />
        </label>

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
            Keep session active for 24 hours
          </span>
        </label>

        <Button
          className="h-14 w-full bg-gradient-to-br from-primary to-primary-container text-base font-black tracking-wide text-white shadow-[0_18px_30px_-18px_rgba(6,78,59,0.45)]"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting
            ? "Processing..."
            : isRegister
              ? "Register & Continue"
              : "Access Fleet Command"}
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
            Or enter with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Google", icon: "account_circle" },
          { label: "Enterprise SSO", icon: "corporate_fare" },
          { label: "Biometric", icon: "fingerprint" },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            disabled={
              item.label !== "Google" ||
              googleLoginMutation.isPending ||
              isSubmitting
            }
            onClick={() => {
              if (item.label === "Google") {
                setStatus(null);
                googleLoginMutation.mutate();
              }
            }}
            className="rounded-xl border border-outline-variant/12 px-3 py-4 text-center transition hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-on-surface-variant">
              {item.icon}
            </span>
            <div className="mt-2 text-[10px] font-black tracking-[0.08em] text-outline uppercase">
              {item.label === "Google" && googleLoginMutation.isPending
                ? "Connecting..."
                : item.label}
            </div>
          </button>
        ))}
      </div>

      <footer className="space-y-5 pt-4">
        <p className="text-center text-[10px] font-medium tracking-[0.14em] text-outline-variant uppercase">
          © 2026 Precision Stream Logistics
        </p>
        <div className="flex items-center justify-center gap-6 text-[10px] font-black tracking-[0.16em] text-outline uppercase">
          <Link href="/auth/login">Privacy</Link>
          <Link href="/auth/register">API Docs</Link>
          <Link href="/tracking">Support</Link>
        </div>
      </footer>
    </div>
  );
}
