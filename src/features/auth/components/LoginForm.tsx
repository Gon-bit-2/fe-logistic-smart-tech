"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { AuthFormMode } from "@/features/auth/types/auth.types";

type LoginFormProps = {
  mode?: AuthFormMode;
};

export default function LoginForm({ mode = "login" }: LoginFormProps) {
  const isRegister = mode === "register";
  const router = useRouter();
  const { login, requestOtpChallenge } = useAuth();
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "Marcus Thorne",
    organization: "Sustainable Goods Co.",
    phone: "+45 000 111 222",
    email: isRegister ? "planner@emerald-logistics.com" : "ops@emerald-logistics.com",
    password: "demo-password",
    persist: true,
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      if (isRegister) {
        const challenge = await requestOtpChallenge({
          email: form.email,
          name: form.name,
          organization: form.organization,
          phone: form.phone,
          password: form.password,
          role: "customer",
        });

        setStatus(`Verification code sent to ${challenge.maskedDestination}`);
        router.push("/auth/otp");
        return;
      }

      const user = await login({
        email: form.email,
        name: form.name || undefined,
        organization: form.organization,
        phone: form.phone,
        password: form.password,
        role: "admin",
      });

      setStatus(`Demo session ready for ${user.role}: ${user.email}`);
      router.push("/orders/create");
    } finally {
      setIsSubmitting(false);
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
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
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
                Forgot key?
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
            className="rounded-xl border border-outline-variant/12 px-3 py-4 text-center transition hover:bg-surface-container-low"
          >
            <span className="material-symbols-outlined text-on-surface-variant">
              {item.icon}
            </span>
            <div className="mt-2 text-[10px] font-black tracking-[0.08em] text-outline uppercase">
              {item.label}
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
