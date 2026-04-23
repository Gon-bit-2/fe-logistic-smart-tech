"use client";

import Link from "next/link";
import { Settings2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuthProfileQuery } from "@/features/auth/presentation/hooks/useAuthProfileQuery";
import { useAuthSession } from "@/features/auth/presentation/hooks/useAuthSession";
import {
  getDashboardHrefForRole,
  getProfileHrefForRole,
} from "@/features/auth/application/services/auth-session";
import { cn } from "@/lib/utils";
import { formatEnumLabel } from "@/utils/formatters";

function shouldHideQuickAccess(pathname: string) {
  return (
    pathname.startsWith("/dashboard/customer") ||
    pathname.startsWith("/dashboard/warehouse") ||
    pathname.startsWith("/overview") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/role-requests")
  );
}

function getOffsetClass(pathname: string) {
  if (
    pathname.startsWith("/dashboard/admin") ||
    pathname.startsWith("/overview") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/notifications") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/role-requests") ||
    pathname.startsWith("/tracking")
  ) {
    return "top-20";
  }

  return "top-4";
}

export default function ProfileQuickAccess() {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthSession();
  const profileQuery = useAuthProfileQuery(isAuthenticated && pathname !== "/");

  if (!isAuthenticated || !user || pathname === "/" || shouldHideQuickAccess(pathname)) {
    return null;
  }

  const profileHref = getProfileHrefForRole(user.role);
  const dashboardHref = getDashboardHrefForRole(user.role);
  const fullName = profileQuery.data?.fullName ?? `User #${user.id}`;
  const email = profileQuery.data?.email ?? "";
  const avatarUrl = profileQuery.data?.avatarUrl ?? null;
  const initials =
    profileQuery.data?.initials ??
    fullName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((segment) => segment[0]?.toUpperCase() ?? "")
      .join("");

  return (
    <div
      className={cn(
        "fixed right-3 z-50 md:right-4",
        getOffsetClass(pathname),
      )}
    >
      <Link
        href={profileHref}
        className="group flex items-center gap-3 rounded-2xl border border-emerald-100/90 bg-white/92 px-3 py-2 shadow-[0_18px_44px_-22px_rgba(6,78,59,0.32)] backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_22px_54px_-24px_rgba(6,78,59,0.42)]"
        aria-label="Mở hồ sơ người dùng"
      >
        <Avatar className="size-10 ring-2 ring-emerald-100">
          <AvatarImage alt={fullName} src={avatarUrl ?? undefined} />
          <AvatarFallback>{initials || "NA"}</AvatarFallback>
        </Avatar>

        <div className="hidden min-w-0 sm:block">
          <div className="flex items-center gap-2">
            <p className="max-w-44 truncate text-sm font-bold text-emerald-950">
              {fullName}
            </p>
            <Badge className="h-5 rounded-full bg-emerald-100 px-2 text-[10px] font-bold uppercase text-emerald-800">
              {formatEnumLabel(user.role)}
            </Badge>
          </div>
          <p className="max-w-52 truncate text-xs text-slate-500">
            {email || dashboardHref}
          </p>
        </div>

        <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition-colors group-hover:bg-emerald-100">
          <Settings2 className="size-4" />
        </span>
      </Link>
    </div>
  );
}
