"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import AuthUserMenu from "@/components/layout/AuthUserMenu";
import AppIcon from "@/components/ui/app-icon";

type OperationsTopBarProps = Readonly<{
  active?: "dashboard" | "shipments" | "tracking";
}>;

type OperationsTopBarItem = {
  href: string;
  id: OperationsTopBarProps["active"];
  label: string;
};

export default function OperationsTopBar({
  active = "shipments",
}: OperationsTopBarProps) {
  const t = useTranslations("operationsTopBar");
  const items =
    typeof t.raw === "function" ? (t.raw("items") as OperationsTopBarItem[]) : [];

  return (
    <header className="sticky top-0 z-40 border-b border-white/30 bg-emerald-50/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 md:px-8">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-xl font-black tracking-tight text-emerald-900"
          >
            {t("brand")}
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
            aria-label={t("notificationsLabel")}
            className="rounded-full p-2 text-slate-700 transition hover:bg-emerald-100/70"
          >
            <AppIcon name="notifications" />
          </button>
          <AuthUserMenu
            defaultFullName="Operations workspace"
            fallbackInitials="OP"
            logoutLabel={t("logoutLabel")}
            profileLabel={t("profileLabel")}
            triggerClassName="border-transparent bg-transparent p-2 shadow-none hover:bg-emerald-100/70 hover:translate-y-0"
          />
        </div>
      </div>
    </header>
  );
}
