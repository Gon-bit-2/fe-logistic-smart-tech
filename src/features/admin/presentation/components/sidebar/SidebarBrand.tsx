"use client";

import { ShieldCheck } from "lucide-react";
import type { AdminShellConfig } from "@/features/admin/domain/types/admin.types";
import { adminSidebarCopy } from "@/i18n/vi";

export interface SidebarBrandProps {
  readonly config: AdminShellConfig;
}

export function SidebarBrand({ config }: Readonly<SidebarBrandProps>) {
  const isDashboard = config.topBarVariant === "dashboard";
  const isEcosystem = config.topBarVariant === "ecosystem";

  if (isDashboard) {
    return (
      <div className="px-2">
        <h1 className="text-lg font-black tracking-tight text-primary">
          Precision Logistics
        </h1>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary-fixed/35 text-primary">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface">
              {adminSidebarCopy.adminConsole}
            </p>
            <p className="text-[0.58rem] font-black uppercase tracking-[0.22em] text-on-surface/35">
              {adminSidebarCopy.globalOperations}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isEcosystem) {
    return (
      <div className="mb-6 hidden md:block">
        <h2 className="text-[0.62rem] font-medium uppercase tracking-[0.22em] text-primary">
          {adminSidebarCopy.dispatcherHub}
        </h2>
        <p className="mt-1 text-[0.68rem] text-on-surface/45">Precision Logistics</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-1">
      <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-container text-white shadow-[0_16px_36px_-18px_rgba(6,78,59,0.45)]">
        <ShieldCheck className="size-5" />
      </div>
      <div>
        <h1 className="text-lg font-black tracking-tight text-primary">
          {config.title}
        </h1>
        <p className="text-[0.58rem] font-black uppercase tracking-[0.22em] text-on-surface/35">
          {adminSidebarCopy.logisticsHub}
        </p>
      </div>
    </div>
  );
}
