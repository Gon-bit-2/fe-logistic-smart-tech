import {
  BarChart3,
  LayoutDashboard,
  Leaf,
  PackageSearch,
  Truck,
  Warehouse,
} from "lucide-react";
import type { AdminNavItem, AdminShellConfig } from "@/features/admin/types/admin.types";

const ecosystemTopTabs = [
  { label: "Dashboard", href: "/dashboard/admin" },
  { label: "Shipments", href: "/dashboard/admin/orders" },
  { label: "Inventory", href: "/dashboard/admin/warehouses" },
] as const;

export const adminNavItems: ReadonlyArray<AdminNavItem> = [
  {
    label: "Overview",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Analytics",
    href: "/dashboard/admin/analytics",
    icon: BarChart3,
  },
  {
    label: "Shipments",
    href: "/dashboard/admin/orders",
    icon: PackageSearch,
  },
  {
    label: "Fleet",
    href: "/dashboard/admin/fleet",
    icon: Truck,
  },
  {
    label: "Sustainability",
    href: "/dashboard/admin/sustainability",
    icon: Leaf,
  },
  {
    label: "Inventory",
    href: "/dashboard/admin/warehouses",
    icon: Warehouse,
  },
];

export const adminShellConfigByPath: Record<string, AdminShellConfig> = {
  "/dashboard/admin": {
    title: "Admin Console",
    topBarVariant: "dashboard",
    searchPlaceholder: "Search shipments...",
    topTabs: ecosystemTopTabs,
    initials: "SC",
  },
  "/dashboard/admin/analytics": {
    title: "Precision Admin",
    topBarVariant: "standard",
    searchPlaceholder: "Search insights...",
    supportLabel: "Support",
    topTabs: ecosystemTopTabs,
    initials: "SA",
  },
  "/dashboard/admin/orders": {
    title: "Dispatcher Hub",
    topBarVariant: "ecosystem",
    searchPlaceholder: "Filter shipments...",
    topTabs: ecosystemTopTabs,
    initials: "SM",
  },
  "/dashboard/admin/fleet": {
    title: "Precision Admin",
    topBarVariant: "standard",
    searchPlaceholder: "Search vehicle IDs or drivers...",
    supportLabel: "Support",
    topTabs: ecosystemTopTabs,
    initials: "FO",
  },
  "/dashboard/admin/sustainability": {
    title: "Precision Admin",
    topBarVariant: "standard",
    searchPlaceholder: "Global tracking search...",
    topTabs: ecosystemTopTabs,
    initials: "SI",
  },
  "/dashboard/admin/warehouses": {
    title: "Dispatcher Hub",
    topBarVariant: "ecosystem",
    searchPlaceholder: "Search inventory...",
    topTabs: ecosystemTopTabs,
    initials: "IH",
  },
};
