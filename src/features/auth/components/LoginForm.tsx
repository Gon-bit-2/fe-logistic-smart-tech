"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";

type LoginFormProps = {
  mode?: "login" | "register";
};

export default function LoginForm({ mode = "login" }: LoginFormProps) {
  const isRegister = mode === "register";
  const { login } = useAuth();
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: isRegister ? "planner@emerald-logistics.com" : "admin@emerald-logistics.com",
    password: "demo-password",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const user = await login({
        email: form.email,
        name: form.name || undefined,
        password: form.password,
        role: isRegister ? "customer" : "admin",
      });

      setStatus(`Demo session ready for ${user.role}: ${user.email}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-[1.75rem] border border-white/10 bg-white p-8 shadow-[0_24px_90px_-42px_rgba(0,0,0,0.28)]"
    >
      <div>
        <p className="text-xs font-black tracking-[0.32em] text-primary uppercase">
          {isRegister ? "Create account" : "Sign in"}
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-on-surface">
          {isRegister ? "Register logistics workspace" : "Access operations portal"}
        </h1>
      </div>

      {isRegister ? (
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-on-surface">Full name</span>
          <input
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
            className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary"
            placeholder="Nguyen Van A"
          />
        </label>
      ) : null}

      <label className="block space-y-2">
        <span className="text-sm font-semibold text-on-surface">Email</span>
        <input
          value={form.email}
          onChange={(event) =>
            setForm((current) => ({ ...current, email: event.target.value }))
          }
          className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary"
          type="email"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-semibold text-on-surface">Password</span>
        <input
          value={form.password}
          onChange={(event) =>
            setForm((current) => ({ ...current, password: event.target.value }))
          }
          className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary"
          type="password"
        />
      </label>

      <Button className="h-12 w-full text-sm font-black uppercase" type="submit">
        {isSubmitting ? "Processing..." : isRegister ? "Register" : "Login"}
      </Button>

      {status ? (
        <p className="rounded-xl bg-primary/8 px-4 py-3 text-sm text-on-surface">
          {status}
        </p>
      ) : null}

      <p className="text-sm text-on-surface-variant">
        {isRegister ? "Already have an account?" : "Need a new workspace?"}{" "}
        <Link
          href={isRegister ? "/login" : "/register"}
          className="font-bold text-primary"
        >
          {isRegister ? "Login" : "Register"}
        </Link>
      </p>
    </form>
  );
}
