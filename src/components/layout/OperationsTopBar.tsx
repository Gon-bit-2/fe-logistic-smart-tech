"use client";

import Link from "next/link";
import AppIcon from "@/components/ui/app-icon";
import { operationsTopBarCopy } from "@/i18n/vi";
import { useAuth } from "@/features/auth/presentation/hooks/useAuth";

type OperationsTopBarProps = Readonly<{
  active?: "dashboard" | "shipments" | "tracking";
}>;

const items = operationsTopBarCopy.items;

export default function OperationsTopBar({
  active = "shipments",
}: OperationsTopBarProps) {
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/30 bg-emerald-50/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 md:px-8">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-xl font-black tracking-tight text-emerald-900"
          >
            {operationsTopBarCopy.brand}
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {items.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`pb-1 text-sm font-medium tracking-tight transition-colors ${
                  active === item.id
                    ? "border-b-2 border-emerald-600 text-emerald-950"
                    : "text-slate-500 hover:text-emerald-700"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Thông báo"
            className="rounded-full p-2 text-slate-700 transition hover:bg-emerald-100/70"
          >
            <AppIcon name="notifications" />
          </button>
          <button
            type="button"
            aria-label="Đăng xuất"
            onClick={() => void logout()}
            className="rounded-full p-2 text-slate-700 transition hover:bg-emerald-100/70"
          >
            <AppIcon name="logout" />
          </button>
        </div>
      </div>
    </header>
  );
}
