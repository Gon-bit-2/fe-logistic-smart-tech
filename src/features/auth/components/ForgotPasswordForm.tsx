"use client";

import Link from "next/link";
import { startTransition, type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRequestForgotPasswordOtpMutation } from "@/features/auth/hooks/useRequestForgotPasswordOtpMutation";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const requestOtpMutation = useRequestForgotPasswordOtpMutation();
  const [status, setStatus] = useState<string | null>(null);
  const [form, setForm] = useState({
    confirmPassword: "demo-password",
    email: "ops@emerald-logistics.com",
    password: "demo-password",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    try {
      await requestOtpMutation.mutateAsync(form);
      setStatus("Verification code sent. Continue to OTP confirmation.");
      startTransition(() => {
        router.push("/auth/otp?mode=forgot-password");
      });
    } catch {
      return;
    }
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-on-surface">
          Reset your access key
        </h1>
        <p className="text-sm leading-6 text-on-surface-variant">
          Request a one-time code and choose a new password for your logistics
          workspace.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
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
          <span className="px-1 text-[10px] font-black tracking-[0.16em] text-outline uppercase">
            New password
          </span>
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

        <label className="block space-y-2">
          <span className="px-1 text-[10px] font-black tracking-[0.16em] text-outline uppercase">
            Confirm password
          </span>
          <Input
            value={form.confirmPassword}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                confirmPassword: event.target.value,
              }))
            }
            className="border-b border-outline-variant/30 pb-3 focus:rounded-lg"
            placeholder="••••••••••••"
            type="password"
          />
        </label>

        <Button
          className="h-14 w-full bg-gradient-to-br from-primary to-primary-container text-base font-black tracking-wide text-white shadow-[0_18px_30px_-18px_rgba(6,78,59,0.45)]"
          disabled={requestOtpMutation.isPending}
          type="submit"
        >
          {requestOtpMutation.isPending ? "Processing..." : "Send Reset Code"}
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

      <footer className="flex items-center justify-between border-t border-outline-variant/10 pt-6 text-sm text-on-surface-variant">
        <Link href="/auth/login" className="font-semibold text-primary">
          Back to login
        </Link>
        <Link href="/tracking" className="font-semibold">
          Support
        </Link>
      </footer>
    </div>
  );
}
