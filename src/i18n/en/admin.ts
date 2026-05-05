import {
  BarChart3,
  ClipboardCheck,
  LayoutDashboard,
  Languages,
  Leaf,
  PackageSearch,
  Route,
  Truck,
  WalletCards,
  Warehouse,
} from "lucide-react";
import type { AdminNavItem, AdminShellConfig } from "@/features/admin/domain/types/admin.types";

const ecosystemTopTabs = [
  { href: "/dashboard/admin", label: "Dashboard" },
  { href: "/dashboard/admin/orders", label: "Shipments" },
  { href: "/dashboard/admin/warehouses", label: "Warehouses" },
] as const;

export const adminNavItems: ReadonlyArray<AdminNavItem> = [
  { href: "/dashboard/admin", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/admin/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/dashboard/admin/role-requests", icon: ClipboardCheck, label: "Role Requests" },
  { href: "/dashboard/admin/orders", icon: PackageSearch, label: "Shipments" },
  { href: "/dashboard/admin/trips", icon: Route, label: "Trips" },
  { href: "/dashboard/admin/fleet", icon: Truck, label: "Fleet" },
  { href: "/dashboard/admin/wallet", icon: WalletCards, label: "COD reconciliation" },
  { href: "/dashboard/admin/sustainability", icon: Leaf, label: "Sustainability" },
  { href: "/dashboard/admin/warehouses", icon: Warehouse, label: "Warehouses" },
  { href: "/dashboard/admin/language", icon: Languages, label: "Language" },
];

export const adminShellConfigByPath: Record<string, AdminShellConfig> = {
  "/dashboard/admin": {
    initials: "SC",
    searchPlaceholder: "Search shipments...",
    title: "Admin dashboard",
    topBarVariant: "dashboard",
    topTabs: ecosystemTopTabs,
  },
  "/dashboard/admin/analytics": {
    initials: "SA",
    searchPlaceholder: "Search insights...",
    supportLabel: "Support",
    title: "Precision Admin",
    topBarVariant: "standard",
    topTabs: ecosystemTopTabs,
  },
  "/dashboard/admin/fleet": {
    initials: "FO",
    searchPlaceholder: "Search vehicle or driver...",
    supportLabel: "Support",
    title: "Precision Admin",
    topBarVariant: "standard",
    topTabs: ecosystemTopTabs,
  },
  "/dashboard/admin/wallet": {
    initials: "COD",
    searchPlaceholder: "Search drivers or COD receipts...",
    supportLabel: "Support",
    title: "Precision admin",
    topBarVariant: "standard",
    topTabs: ecosystemTopTabs,
  },
  "/dashboard/admin/orders": {
    initials: "SM",
    searchPlaceholder: "Filter shipments...",
    title: "Dispatch center",
    topBarVariant: "ecosystem",
    topTabs: ecosystemTopTabs,
  },
  "/dashboard/admin/trips": {
    initials: "TR",
    searchPlaceholder: "Search trip or plate...",
    supportLabel: "Support",
    title: "Precision Admin",
    topBarVariant: "standard",
    topTabs: ecosystemTopTabs,
  },
  "/dashboard/admin/notifications": {
    initials: "NT",
    searchPlaceholder: "Search notifications...",
    supportLabel: "Support",
    title: "Precision Admin",
    topBarVariant: "standard",
    topTabs: ecosystemTopTabs,
  },
  "/dashboard/admin/role-requests": {
    initials: "RR",
    searchPlaceholder: "Search role requests...",
    supportLabel: "Support",
    title: "Precision Admin",
    topBarVariant: "standard",
    topTabs: ecosystemTopTabs,
  },
  "/dashboard/admin/sustainability": {
    initials: "SI",
    searchPlaceholder: "Search global tracking...",
    title: "Precision Admin",
    topBarVariant: "standard",
    topTabs: ecosystemTopTabs,
  },
  "/dashboard/admin/warehouses": {
    initials: "IH",
    searchPlaceholder: "Search warehouses...",
    title: "Dispatch center",
    topBarVariant: "ecosystem",
    topTabs: ecosystemTopTabs,
  },
  "/dashboard/admin/language": {
    initials: "LG",
    searchPlaceholder: "Search languages...",
    supportLabel: "Support",
    title: "Precision Admin",
    topBarVariant: "standard",
    topTabs: ecosystemTopTabs,
  },
};

export const adminScreenCopy = {
  actions: "Actions",
  currentEta: "Estimated ETA",
  customer: "Customer",
  description:
    "Manage shipments, business performance, and environmental indicators in one consistent interface.",
  emptyDescription:
    "No shipment data is available in the system yet.",
  emptyTitle: "No operations data",
  integrationPendingDescription:
    "Real-time mapping and dispatch will be available once real trip data is connected.",
  integrationPendingTitle: "Visual dispatch is waiting for integration",
  loadingDescription:
    "Loading operations data...",
  loadingTitle: "Loading control board",
  metrics: {
    activeOrders: "Active orders",
    availableVehicles: "Available vehicles",
    electricVehicles: "Electric / hybrid vehicles",
  },
  recentOrders: "Recent active orders",
  title: "Intelligent operations command center",
  trackingId: "Tracking ID",
  viewAll: "View all",
} as const;

export const adminTopBarCopy = {
  adminLabel: "Admin",
  ecosystemBrand: "Precision ecosystem",
  logoutLabel: "Log out",
  profileLabel: "Profile",
} as const;

export const adminSidebarCopy = {
  addNewRoute: "Add new route",
  adminConsole: "Admin console",
  dispatcherHub: "Dispatch hub",
  globalOperations: "Global operations",
  helpCenter: "Help center",
  logisticsHub: "Logistics hub",
  logout: "Log out",
  newDispatch: "Create dispatch",
  newShipment: "Create shipment",
  signOut: "Sign out",
} as const;

export const dispatcherScreenCopy = {
  autoOptimize: "Auto-optimize route",
  liveSystem: "Live system",
  operationalFlow: "Operational flow",
} as const;
