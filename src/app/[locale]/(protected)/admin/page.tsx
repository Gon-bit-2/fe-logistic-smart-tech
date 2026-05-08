import type { Metadata } from "next";
import { DispatcherDashboardScreen } from "@/features/admin";

export const metadata: Metadata = {
  title: "Bảng Điều Khiển | Emerald Logistics",
  description: "Quản lý đơn hàng, fleet và tuyến đường logistics",
};

export default function AdminDashboardPage() {
  return <DispatcherDashboardScreen />;
}
