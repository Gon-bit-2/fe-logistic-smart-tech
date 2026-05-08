import {
  BarChart3,
  Activity,
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
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Shipments" },
  { href: "/admin/warehouses", label: "Warehouses" },
] as const;

export const adminNavItems: ReadonlyArray<AdminNavItem> = [
  { href: "/admin", icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/admin/observability", icon: Activity, label: "Production ops" },
  { href: "/admin/role-requests", icon: ClipboardCheck, label: "Role Requests" },
  { href: "/admin/orders", icon: PackageSearch, label: "Shipments" },
  { href: "/admin/trips", icon: Route, label: "Trips" },
  { href: "/admin/fleet", icon: Truck, label: "Fleet" },
  { href: "/admin/wallet", icon: WalletCards, label: "COD reconciliation" },
  { href: "/admin/sustainability", icon: Leaf, label: "Sustainability" },
  { href: "/admin/warehouses", icon: Warehouse, label: "Warehouses" },
  { href: "/admin/language", icon: Languages, label: "Language" },
];

export const adminShellConfigByPath: Record<string, AdminShellConfig> = {
  "/admin": {
    initials: "SC",
    searchPlaceholder: "Search shipments...",
    title: "Admin dashboard",
    topBarVariant: "dashboard",
    topTabs: ecosystemTopTabs,
  },
  "/admin/analytics": {
    initials: "SA",
    searchPlaceholder: "Search insights...",
    supportLabel: "Support",
    title: "Precision Admin",
    topBarVariant: "standard",
    topTabs: ecosystemTopTabs,
  },
  "/admin/fleet": {
    initials: "FO",
    searchPlaceholder: "Search vehicle or driver...",
    supportLabel: "Support",
    title: "Precision Admin",
    topBarVariant: "standard",
    topTabs: ecosystemTopTabs,
  },
  "/admin/observability": {
    initials: "OBS",
    searchPlaceholder: "Search queues, endpoints, or audit...",
    supportLabel: "Support",
    title: "Precision Admin",
    topBarVariant: "standard",
    topTabs: ecosystemTopTabs,
  },
  "/admin/wallet": {
    initials: "COD",
    searchPlaceholder: "Search drivers or COD receipts...",
    supportLabel: "Support",
    title: "Precision admin",
    topBarVariant: "standard",
    topTabs: ecosystemTopTabs,
  },
  "/admin/orders": {
    initials: "SM",
    searchPlaceholder: "Filter shipments...",
    title: "Dispatch center",
    topBarVariant: "ecosystem",
    topTabs: ecosystemTopTabs,
  },
  "/admin/trips": {
    initials: "TR",
    searchPlaceholder: "Search trip or plate...",
    supportLabel: "Support",
    title: "Precision Admin",
    topBarVariant: "standard",
    topTabs: ecosystemTopTabs,
  },
  "/admin/notifications": {
    initials: "NT",
    searchPlaceholder: "Search notifications...",
    supportLabel: "Support",
    title: "Precision Admin",
    topBarVariant: "standard",
    topTabs: ecosystemTopTabs,
  },
  "/admin/role-requests": {
    initials: "RR",
    searchPlaceholder: "Search role requests...",
    supportLabel: "Support",
    title: "Precision Admin",
    topBarVariant: "standard",
    topTabs: ecosystemTopTabs,
  },
  "/admin/sustainability": {
    initials: "SI",
    searchPlaceholder: "Search global tracking...",
    title: "Precision Admin",
    topBarVariant: "standard",
    topTabs: ecosystemTopTabs,
  },
  "/admin/warehouses": {
    initials: "IH",
    searchPlaceholder: "Search warehouses...",
    title: "Dispatch center",
    topBarVariant: "ecosystem",
    topTabs: ecosystemTopTabs,
  },
  "/admin/language": {
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
