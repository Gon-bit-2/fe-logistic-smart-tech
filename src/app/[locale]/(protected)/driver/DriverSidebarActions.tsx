"use client";

import { Link } from "@/i18n/routing";
import { LogOut, UserRound } from "lucide-react";
import { useAuth } from "@/features/auth/presentation/hooks/useAuth";

export default function DriverSidebarActions() {
  const { logout } = useAuth();

  return (
    <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
      <Link
        href="/profile"
        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-white hover:text-slate-900"
      >
        <UserRound className="size-5" />
        Hồ sơ cá nhân
      </Link>
      <button
        onClick={() => void logout()}
        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
      >
        <LogOut className="size-5" />
        Đăng xuất
      </button>
    </div>
  );
}
