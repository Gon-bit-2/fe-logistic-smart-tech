import type { ReactNode } from "react";

export type SidebarItem = {
  href: string;
  label: string;
  icon?: ReactNode;
};

export type SidebarProps = {
  title?: string;
  items: SidebarItem[];
  footerNote?: string;
  footerActions?: ReactNode;
};

export type CustomerNavItem = {
  href: string;
  icon: ReactNode;
  isActive: (pathname: string) => boolean;
  label: string;
};

export type DriverNavItem = {
  href: string;
  icon: ReactNode;
  isActive: (pathname: string) => boolean;
  label: string;
};

export type FooterLink = {
  href: string;
  label: string;
};
