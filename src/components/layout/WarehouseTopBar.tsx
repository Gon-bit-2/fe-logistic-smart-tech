"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Bell,
  Home,
  LogOut,
  Package,
  ShieldCheck,
  Truck,
  UserRound,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/presentation/hooks/useAuth";
import { useAuthProfileQuery } from "@/features/auth/presentation/hooks/useAuthProfileQuery";
import CustomerNotificationsPanel from "@/features/notifications/presentation/components/CustomerNotificationsPanel";
import { useUnreadNotificationsCount } from "@/features/notifications/presentation/hooks/useNotifications";
import { cn } from "@/lib/utils";
import { formatEnumLabel } from "@/utils/formatters";

type WarehouseNavItem = {
  href: string;
  icon: React.ReactNode;
  isActive: (pathname: string) => boolean;
  label: string;
};

const warehouseNavItems: WarehouseNavItem[] = [
  {
    href: "/dashboard/warehouse",
    icon: <Home className="size-4" />,
    isActive: (pathname) => pathname === "/dashboard/warehouse",
    label: "Trạm Quét Mã",
  },
  {
    href: "/dashboard/warehouse/orders",
    icon: <Package className="size-4" />,
    isActive: (pathname) => pathname.startsWith("/dashboard/warehouse/orders"),
    label: "Đơn hàng",
  },
  {
    href: "/dashboard/warehouse/trips",
    icon: <Truck className="size-4" />,
    isActive: (pathname) => pathname.startsWith("/dashboard/warehouse/trips"),
    label: "Chuyến xe",
  },
  {
    href: "/dashboard/warehouse/roles",
    icon: <ShieldCheck className="size-4" />,
    isActive: (pathname) => pathname.startsWith("/dashboard/warehouse/roles"),
    label: "Role",
  },
];

export default function WarehouseTopBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { logout, user } = useAuth();
  const profileQuery = useAuthProfileQuery(Boolean(user));
  const unreadQuery = useUnreadNotificationsCount(Boolean(user));
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const bellContainerRef = useRef<HTMLDivElement | null>(null);
  const unreadCount = unreadQuery.data?.totalUnread ?? 0;
  const fullName = profileQuery.data?.fullName ?? "Warehouse workspace";
  const avatarUrl = profileQuery.data?.avatarUrl ?? null;
  const fallbackInitials =
    fullName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((segment) => segment[0]?.toUpperCase() ?? "")
      .join("") || "WH";
  const initials =
    profileQuery.data?.initials ?? fallbackInitials;
  const shouldOpenNotifications = searchParams.get("notifications") === "1";

  useEffect(() => {
    if (!shouldOpenNotifications) {
      return;
    }

    setIsNotificationsOpen(true);
  }, [shouldOpenNotifications]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        bellContainerRef.current &&
        !bellContainerRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-200/80 bg-[linear-gradient(180deg,rgba(236,253,245,0.96),rgba(255,255,255,0.9))] backdrop-blur-xl shadow-[0_22px_50px_-26px_rgba(6,78,59,0.35)]">
      <div className="mx-auto max-w-[1440px] px-4 py-2 md:px-8 md:py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <Link
              href="/dashboard/warehouse"
              className="text-base md:text-lg font-black tracking-tight text-emerald-950 transition-colors hover:text-emerald-700"
            >
              Emerald Warehouse Hub
            </Link>
            <div className="flex flex-wrap items-center gap-2 text-[11px] md:text-xs text-slate-500">
              <span className="hidden sm:inline">Kiểm soát luồng hàng hóa và điều phối trạm kho</span>
              <Badge className="h-4 rounded-full bg-emerald-100 px-1.5 text-[9px] font-bold uppercase text-emerald-800">
                {formatEnumLabel(user?.role ?? "warehouse_staff")}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div ref={bellContainerRef} className="relative">
              <button
                type="button"
                onClick={() =>
                  setIsNotificationsOpen((current) => !current)
                }
                className={cn(
                  "relative rounded-full border border-white/70 bg-white/85 p-2 text-slate-600 transition-colors hover:text-emerald-700",
                  isNotificationsOpen && "text-emerald-700 ring-2 ring-emerald-200",
                )}
                aria-expanded={isNotificationsOpen}
                aria-haspopup="dialog"
                aria-label="Mở thông báo"
              >
                <Bell className="size-4" />
                {unreadCount > 0 ? (
                  <span className="absolute -right-1 -top-1 inline-flex min-w-4 items-center justify-center rounded-full bg-red-500 px-1 py-0.5 text-[0.6rem] font-black text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                ) : null}
              </button>

              {isNotificationsOpen ? (
                <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50">
                  <CustomerNotificationsPanel
                    enabled={isNotificationsOpen || shouldOpenNotifications}
                  />
                </div>
              ) : null}
            </div>

            <div className="group flex items-center gap-2 rounded-full border border-white/70 bg-white/85 px-2 py-1 text-left shadow-sm transition-all hover:-translate-y-0.5 cursor-default">
              <Avatar className="size-8 ring-2 ring-emerald-100">
                <AvatarImage alt={fullName} src={avatarUrl ?? undefined} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="hidden min-w-0 sm:block">
                <p className="max-w-32 truncate text-xs font-bold text-emerald-950">
                  {fullName}
                </p>
                <p className="text-[10px] text-slate-500 leading-tight">Hồ sơ</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => void logout()}
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-950 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-emerald-800"
            >
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </div>
        </div>

        <nav className="mt-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-center gap-2 rounded-2xl border border-emerald-100/80 bg-white/80 p-1.5 shadow-inner shadow-emerald-50">
            {warehouseNavItems.map((item) => {
              const isActive = item.isActive(pathname);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-semibold transition-all",
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-800",
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}
