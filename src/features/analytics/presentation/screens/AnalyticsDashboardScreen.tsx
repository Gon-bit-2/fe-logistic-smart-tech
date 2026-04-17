import { Filter } from "lucide-react";
import { IntegrationPendingState } from "@/components/ui/data-states";
import { PageHeader } from "@/features/admin/presentation/components/admin-primitives";
import { analyticsFilters, analyticsScreenCopy } from "@/i18n/vi";

export interface AnalyticsDashboardScreenProps {
  readonly _unused?: never;
}

export default function AnalyticsDashboardScreen(
  _props: Readonly<AnalyticsDashboardScreenProps>,
) {
  void _props;

  return (
    <div className="space-y-8">
      <PageHeader
        title={analyticsScreenCopy.title}
        description={analyticsScreenCopy.subtitle}
        actions={
          <div className="flex flex-wrap items-center gap-3 rounded-[1.6rem] bg-surface-container-low p-2">
            {analyticsFilters.map((filter, index) => (
              <button
                key={filter}
                type="button"
                className={
                  index === 0
                    ? "rounded-[1.2rem] bg-surface-container-lowest px-5 py-3 text-lg font-black text-primary shadow-[0_16px_32px_-26px_rgba(6,78,59,0.35)]"
                    : "rounded-[1.2rem] px-5 py-3 text-lg font-medium text-on-surface/50 transition-colors hover:text-primary"
                }
              >
                {filter}
              </button>
            ))}
            <button
              type="button"
              className="rounded-[1.2rem] p-3 text-on-surface/45 transition-colors hover:bg-surface-container-lowest hover:text-primary"
            >
              <Filter className="size-6" />
            </button>
          </div>
        }
      />

      <IntegrationPendingState
        title={analyticsScreenCopy.integrationPendingTitle}
        description={analyticsScreenCopy.integrationPendingDescription}
      />
    </div>
  );
}

