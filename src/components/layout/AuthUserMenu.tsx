"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  getProfileHrefForRole,
} from "@/features/auth/application/services/auth-session";
import { useAuth } from "@/features/auth/presentation/hooks/useAuth";
import { useAuthProfileQuery } from "@/features/auth/presentation/hooks/useAuthProfileQuery";
import { cn } from "@/lib/utils";
import { formatEnumLabel } from "@/utils/formatters";

type AuthUserMenuProps = Readonly<{
  className?: string;
  defaultFullName: string;
  fallbackInitials: string;
  logoutLabel: string;
  loggingOutLabel?: string;
  profileLabel: string;
  profileHref?: string;
  triggerClassName?: string;
}>;

function getInitials(fullName: string, fallbackInitials: string) {
  return (
    fullName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((segment) => segment[0]?.toUpperCase() ?? "")
      .join("") || fallbackInitials
  );
}

export default function AuthUserMenu({
  className,
  defaultFullName,
  fallbackInitials,
  logoutLabel,
  loggingOutLabel,
  profileHref,
  profileLabel,
  triggerClassName,
}: AuthUserMenuProps) {
  const { accessToken, isLoggingOut, logout, user } = useAuth();
  const profileQuery = useAuthProfileQuery(Boolean(accessToken && user));
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fullName = profileQuery.data?.fullName ?? defaultFullName;
  const avatarUrl = profileQuery.data?.avatarUrl ?? null;
  const initials =
    profileQuery.data?.initials ?? getInitials(fullName, fallbackInitials);
  const roleLabel = user?.role ? formatEnumLabel(user.role) : null;
  const resolvedProfileHref = profileHref ?? getProfileHrefForRole(user?.role);
  const visibleLogoutLabel =
    isLoggingOut && loggingOutLabel ? loggingOutLabel : logoutLabel;

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  async function handleLogout() {
    await logout();
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        data-testid="auth-user-menu-trigger"
        onClick={() => setIsOpen((current) => !current)}
        className={cn(
          "group flex items-center gap-2 rounded-full border border-white/70 bg-white/85 px-2 py-1 text-left shadow-sm transition-all hover:-translate-y-0.5",
          triggerClassName,
        )}
      >
        <Avatar className="size-8 ring-2 ring-emerald-100">
          <AvatarImage alt={fullName} src={avatarUrl ?? undefined} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="hidden min-w-0 sm:block">
          <p className="max-w-32 truncate text-xs font-bold text-emerald-950">
            {fullName}
          </p>
          <p className="text-[10px] leading-tight text-slate-500">
            {profileLabel}
          </p>
        </div>
        <ChevronDown
          className={cn(
            "hidden size-3.5 text-slate-400 transition-transform sm:block",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-64 overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-[0_22px_60px_-28px_rgba(6,78,59,0.45)]"
        >
          <div className="flex items-center gap-3 border-b border-emerald-50 px-3 py-3">
            <Avatar className="size-10 ring-2 ring-emerald-100">
              <AvatarImage alt={fullName} src={avatarUrl ?? undefined} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-emerald-950">
                {fullName}
              </p>
              {roleLabel ? (
                <Badge className="mt-1 h-5 rounded-full bg-emerald-100 px-2 text-[10px] font-bold uppercase text-emerald-800">
                  {roleLabel}
                </Badge>
              ) : null}
            </div>
          </div>

          <div className="p-1.5">
            <Link
              href={resolvedProfileHref}
              role="menuitem"
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-800"
              onClick={() => setIsOpen(false)}
            >
              <UserRound className="size-4" />
              {profileLabel}
            </Link>
            <button
              type="button"
              role="menuitem"
              data-testid="auth-user-menu-logout"
              disabled={isLoggingOut}
              onClick={() => void handleLogout()}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-wait disabled:opacity-60"
            >
              <LogOut className="size-4" />
              {visibleLogoutLabel}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
