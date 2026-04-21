import type { ReactNode } from "react";
import Sidebar, { type SidebarItem } from "@/components/layout/Sidebar";
import RoleGuard from "@/features/auth/presentation/components/RoleGuard";
import { ROUTE_PERMISSIONS } from "@/features/auth/domain/constants/rbac.config";
import { Home, Truck, Route, Bell, ShieldCheck } from "lucide-react";

const driverSidebarItems: SidebarItem[] = [
  { href: "/dashboard/driver", label: "Không gian tài xế", icon: <Home className="size-5" /> },
  { href: "/dashboard/driver/vehicle", label: "Quản lý phương tiện", icon: <Truck className="size-5" /> },
  { href: "/dashboard/driver/trips", label: "Chuyến đi", icon: <Route className="size-5" /> },
  { href: "/dashboard/driver/notifications", label: "Thông báo", icon: <Bell className="size-5" /> },
  { href: "/dashboard/driver/roles", label: "Đăng ký Role", icon: <ShieldCheck className="size-5" /> },
];

export default function DriverLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <RoleGuard allowedRoles={ROUTE_PERMISSIONS.DRIVER}>
      <div className="min-h-screen bg-surface-container-low lg:grid lg:grid-cols-[280px_1fr]">
        <Sidebar 
          title="Tài Xế" 
          items={driverSidebarItems} 
          footerNote="Theo dõi chuyến đi và báo cáo trạng thái phương tiện."
        />
        <main className="px-6 py-8 md:px-8">{children}</main>
      </div>
    </RoleGuard>
  );
}
