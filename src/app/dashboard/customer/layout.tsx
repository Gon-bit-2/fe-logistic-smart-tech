import type { ReactNode } from "react";
import RoleGuard from "@/features/auth/presentation/components/RoleGuard";
import { ROUTE_PERMISSIONS } from "@/features/auth/domain/constants/rbac.config";
import Sidebar, { type SidebarItem } from "@/components/layout/Sidebar";
import { Home, Package, Bell, Settings, ShieldCheck } from "lucide-react";

const customerSidebarItems: SidebarItem[] = [
  { href: "/dashboard/customer", label: "Tổng quan", icon: <Home className="size-5" /> },
  { href: "/dashboard/customer/orders", label: "Đơn hàng của tôi", icon: <Package className="size-5" /> },
  { href: "/dashboard/customer/notifications", label: "Thông báo", icon: <Bell className="size-5" /> },
  { href: "/dashboard/customer/settings", label: "Cài đặt", icon: <Settings className="size-5" /> },
  { href: "/dashboard/customer/roles", label: "Đăng ký Role", icon: <ShieldCheck className="size-5" /> },
];

export default function CustomerLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <RoleGuard allowedRoles={ROUTE_PERMISSIONS.CUSTOMER}>
      <div className="min-h-screen bg-[#F0FDF4] lg:grid lg:grid-cols-[280px_1fr]">
        <Sidebar 
          title="Khách Hàng" 
          items={customerSidebarItems} 
          footerNote="Tra cứu đơn hàng và quản lý tài khoản cá nhân."
        />
        <main className="min-h-screen">{children}</main>
      </div>
    </RoleGuard>
  );
}
