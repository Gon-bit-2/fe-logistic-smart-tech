import {
  BarChart3,
  LayoutDashboard,
  Leaf,
  PackageSearch,
  Truck,
  Warehouse,
} from "lucide-react";
import type { AdminNavItem, AdminShellConfig } from "@/features/admin/domain/types/admin.types";

const ecosystemTopTabs = [
  { href: "/dashboard/admin", label: "Bảng điều khiển" },
  { href: "/dashboard/admin/orders", label: "Lô hàng" },
  { href: "/dashboard/admin/warehouses", label: "Tồn kho" },
] as const;

export const adminNavItems: ReadonlyArray<AdminNavItem> = [
  { href: "/dashboard/admin", icon: LayoutDashboard, label: "Tổng quan" },
  { href: "/dashboard/admin/analytics", icon: BarChart3, label: "Phân tích" },
  { href: "/dashboard/admin/orders", icon: PackageSearch, label: "Lô hàng" },
  { href: "/dashboard/admin/fleet", icon: Truck, label: "Đội xe" },
  { href: "/dashboard/admin/sustainability", icon: Leaf, label: "Bền vững" },
  { href: "/dashboard/admin/warehouses", icon: Warehouse, label: "Tồn kho" },
];

export const adminShellConfigByPath: Record<string, AdminShellConfig> = {
  "/dashboard/admin": {
    initials: "SC",
    searchPlaceholder: "Tìm kiếm lô hàng...",
    title: "Bảng điều khiển quản trị",
    topBarVariant: "dashboard",
    topTabs: ecosystemTopTabs,
  },
  "/dashboard/admin/analytics": {
    initials: "SA",
    searchPlaceholder: "Tìm kiếm insight...",
    supportLabel: "Hỗ trợ",
    title: "Precision Admin",
    topBarVariant: "standard",
    topTabs: ecosystemTopTabs,
  },
  "/dashboard/admin/fleet": {
    initials: "FO",
    searchPlaceholder: "Tìm mã xe hoặc tài xế...",
    supportLabel: "Hỗ trợ",
    title: "Precision Admin",
    topBarVariant: "standard",
    topTabs: ecosystemTopTabs,
  },
  "/dashboard/admin/orders": {
    initials: "SM",
    searchPlaceholder: "Lọc lô hàng...",
    title: "Trung tâm điều phối",
    topBarVariant: "ecosystem",
    topTabs: ecosystemTopTabs,
  },
  "/dashboard/admin/sustainability": {
    initials: "SI",
    searchPlaceholder: "Tìm kiếm theo dõi toàn cục...",
    title: "Precision Admin",
    topBarVariant: "standard",
    topTabs: ecosystemTopTabs,
  },
  "/dashboard/admin/warehouses": {
    initials: "IH",
    searchPlaceholder: "Tìm kiếm tồn kho...",
    title: "Trung tâm điều phối",
    topBarVariant: "ecosystem",
    topTabs: ecosystemTopTabs,
  },
};

export const adminScreenCopy = {
  actions: "Thao tác",
  currentEta: "ETA dự kiến",
  customer: "Khách hàng",
  description:
    "Hiển thị xuyên suốt các lô hàng, doanh thu và hiệu suất carbon trong cùng một ngôn ngữ vận hành gọn nhẹ.",
  emptyDescription:
    "Orders API chưa trả về lô hàng nào để hiển thị trên bảng điều hành nội bộ.",
  emptyTitle: "Chưa có dữ liệu vận hành",
  integrationPendingDescription:
    "Bản đồ tuyến, mức tải xe và điều phối kéo-thả chỉ được bật khi backend cung cấp thêm dữ liệu trip và phân công theo thời gian thực.",
  integrationPendingTitle: "Phần điều phối trực quan đang chờ tích hợp",
  loadingDescription:
    "Đang tải dữ liệu vận hành từ Orders API và Vehicles API để dựng bảng điều hành nội bộ.",
  loadingTitle: "Đang tải bảng điều hành",
  metrics: {
    activeOrders: "Đơn hàng đang hoạt động",
    availableVehicles: "Xe đang sẵn sàng",
    electricVehicles: "Xe điện / hybrid",
  },
  recentOrders: "Đơn hàng hoạt động gần đây",
  title: "Trung tâm điều hành vận hành thông minh",
  trackingId: "Mã theo dõi",
  viewAll: "Xem tất cả",
} as const;

export const adminTopBarCopy = {
  adminLabel: "Quản trị",
  ecosystemBrand: "Hệ sinh thái Precision",
} as const;

export const adminSidebarCopy = {
  addNewRoute: "Thêm tuyến mới",
  adminConsole: "Bảng điều khiển quản trị",
  dispatcherHub: "Trung tâm điều phối",
  globalOperations: "Vận hành toàn cục",
  helpCenter: "Trung tâm hỗ trợ",
  logisticsHub: "Trung tâm logistics",
  logout: "Đăng xuất",
  newDispatch: "Tạo điều phối mới",
  newShipment: "Tạo lô hàng mới",
  signOut: "Thoát phiên",
} as const;

export const dispatcherScreenCopy = {
  autoOptimize: "Tự động tối ưu tuyến",
  liveSystem: "Hệ thống trực tuyến",
  operationalFlow: "Luồng vận hành",
} as const;
