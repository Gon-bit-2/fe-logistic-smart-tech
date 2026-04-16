import { Sparkles, Zap } from "lucide-react";
import DispatcherFleetStatusPanel from "@/features/admin/components/DispatcherFleetStatusPanel";
import DispatcherMapCanvas from "@/features/admin/components/DispatcherMapCanvas";
import DispatcherUnassignedOrdersPanel from "@/features/admin/components/DispatcherUnassignedOrdersPanel";

export interface DispatcherDashboardScreenProps {
  readonly _unused?: never;
}

export default function DispatcherDashboardScreen(
  _props: Readonly<DispatcherDashboardScreenProps>,
) {
  void _props;

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface">
      <DispatcherMapCanvas />

      <section className="flex min-h-0 flex-1 flex-col gap-4 bg-surface-container-low/35 px-4 py-4 md:px-5 md:py-5 xl:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[1.15rem] font-bold tracking-tight text-on-surface md:text-[1.25rem]">
              Operational Flow
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1 text-[0.62rem] font-black uppercase tracking-[0.14em] text-primary">
              <Zap className="size-3" />
              System Live
            </span>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-[0.65rem] bg-tertiary px-4 py-2.5 text-[0.72rem] font-bold text-white shadow-[0_20px_32px_-20px_rgba(0,101,145,0.6)] transition-transform hover:-translate-y-0.5"
          >
            <Sparkles className="size-3.5" />
            Auto-Optimize Routes
          </button>
        </div>

        <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-2">
          <DispatcherFleetStatusPanel />
          <DispatcherUnassignedOrdersPanel />
        </div>
      </section>
    </div>
  );
}
