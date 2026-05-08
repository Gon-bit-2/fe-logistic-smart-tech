"use client";
import { usePathname } from "@/i18n/routing";
import AdminSidebar from "@/features/admin/presentation/components/AdminSidebar";
import AdminTopBar from "@/features/admin/presentation/components/AdminTopBar";
import { useI18nCopy } from "@/i18n/useCopy";
import { cn } from "@/lib/utils";
import type { AdminShellProps } from "../types/layout.types";

export default function AdminShell({ children }: Readonly<AdminShellProps>) {
  const { adminShellConfigByPath } = useI18nCopy();
  const pathname = usePathname();
  const matchedPath =
    adminShellConfigByPath[pathname] !== undefined
      ? pathname
      : Object.keys(adminShellConfigByPath)
          .sort((left, right) => right.length - left.length)
          .find((item) => pathname.startsWith(`${item}/`));
  const config =
    (matchedPath ? adminShellConfigByPath[matchedPath] : undefined) ??
    adminShellConfigByPath["/admin"];
  const isDashboard = config.topBarVariant === "dashboard";
  const isEcosystem = config.topBarVariant === "ecosystem";

  if (isEcosystem) {
    return (
      <div className="min-h-screen bg-background">
        <AdminTopBar config={config} pathname={pathname} />
        <AdminSidebar config={config} />
        <main className="min-w-0 px-4 py-6 md:ml-64 md:min-h-[calc(100vh-4rem)] md:px-8 md:py-8">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar config={config} />
      <div className="min-w-0 md:ml-64">
        <AdminTopBar config={config} pathname={pathname} />
        <main
          className={cn(
            isDashboard
              ? "px-4 py-6 md:px-8 md:py-8 xl:px-10 min-h-[calc(100vh-4rem)] overflow-hidden"
              : "px-4 py-6 md:min-h-[calc(100vh-4rem)] md:px-8 md:py-8 xl:px-10",
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
