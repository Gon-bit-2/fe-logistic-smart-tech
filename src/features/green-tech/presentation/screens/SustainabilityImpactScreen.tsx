import { PageHeader } from "@/features/admin/presentation/components/admin-primitives";
import { useI18nCopy } from "@/i18n/useCopy";
import CO2Dashboard from "@/features/green-tech/presentation/components/CO2Dashboard";
import EmissionTimeline from "@/features/green-tech/presentation/components/EmissionTimeline";

export interface SustainabilityImpactScreenProps {
  readonly _unused?: never;
}

export default function SustainabilityImpactScreen(
  _props: Readonly<SustainabilityImpactScreenProps>,
) {
  void _props;
  const { sustainabilityScreenCopy } = useI18nCopy();

  return (
    <div className="space-y-8">
      <PageHeader
        title={sustainabilityScreenCopy.title}
        description={sustainabilityScreenCopy.description}
      />
      
      <div className="space-y-6">
        <CO2Dashboard />
        <EmissionTimeline />
      </div>
    </div>
  );
}
