"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type SidebarItem = {
  href: string;
  label: string;
  icon?: React.ReactNode;
};

type SidebarProps = {
  title?: string;
  items: SidebarItem[];
  footerNote?: string;
  footerActions?: React.ReactNode;
};

export default function Sidebar({
  title = "Điều hướng",
  items,
  footerNote,
  footerActions,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-full max-w-[280px] flex-col border-r border-border bg-surface-container-low px-5 py-6">
      <div className="mb-8">
        <p className="text-xs font-black tracking-[0.3em] text-primary uppercase">
          Menu
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-on-surface">
          {title}
        </h2>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {items.map((item) => {
          // Exact match for the dashboard root, or startsWith for subpages
          const isRoot = item.href.split("/").length <= 3;
          const isActive = isRoot
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate-600 hover:bg-white hover:text-slate-900",
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        {footerNote && (
          <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4 text-sm text-slate-600">
            {footerNote}
          </div>
        )}
        {footerActions}
      </div>
    </aside>
  );
}
