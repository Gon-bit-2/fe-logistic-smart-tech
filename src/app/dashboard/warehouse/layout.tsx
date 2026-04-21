import type { ReactNode } from "react";
import RoleGuard from "@/features/auth/presentation/components/RoleGuard";
import { ROUTE_PERMISSIONS } from "@/features/auth/domain/constants/rbac.config";
import Sidebar, { type SidebarItem } from "@/components/layout/Sidebar";
import { Home, Package, Truck, Bell, ShieldCheck } from "lucide-react";

const warehouseSidebarItems: SidebarItem[] = [
  { href: "/dashboard/warehouse", label: "Trạm Quét Mã", icon: <Home className="size-5" /> },
  { href: "/dashboard/warehouse/orders", label: "Quản lý Đơn hàng", icon: <Package className="size-5" /> },
  { href: "/dashboard/warehouse/trips", label: "Quản lý Chuyến xe", icon: <Truck className="size-5" /> },
  { href: "/dashboard/warehouse/notifications", label: "Thông báo", icon: <Bell className="size-5" /> },
  { href: "/dashboard/warehouse/roles", label: "Đăng ký Role", icon: <ShieldCheck className="size-5" /> },
];

export default function WarehouseLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <RoleGuard allowedRoles={ROUTE_PERMISSIONS.WAREHOUSE}>
      <div className="min-h-screen bg-[#F0FDF4] lg:grid lg:grid-cols-[280px_1fr]">
        <Sidebar 
          title="Nhân Viên Kho" 
          items={warehouseSidebarItems} 
          footerNote="Kiểm soát luồng hàng hóa và điều phối trạm kho."
        />
        <main className="min-h-screen">{children}</main>
      </div>
    </RoleGuard>
  );
}
