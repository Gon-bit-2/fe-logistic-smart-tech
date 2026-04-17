import { IntegrationPendingState } from "@/components/ui/data-states";
import { PageHeader } from "@/features/admin/presentation/components/admin-primitives";
import { sustainabilityScreenCopy } from "@/i18n/vi";

export interface SustainabilityImpactScreenProps {
  readonly _unused?: never;
}

export default function SustainabilityImpactScreen(
  _props: Readonly<SustainabilityImpactScreenProps>,
) {
  void _props;
  return (
    <div className="space-y-8">
      <PageHeader
        title={sustainabilityScreenCopy.title}
        description={sustainabilityScreenCopy.description}
      />
      <IntegrationPendingState
        title={sustainabilityScreenCopy.pendingTitle}
        description={sustainabilityScreenCopy.pendingDescription}
      />
    </div>
  );
}

