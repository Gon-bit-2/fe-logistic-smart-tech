import { IntegrationPendingState } from "@/components/ui/data-states";
import { adminScreenCopy } from "@/i18n/vi";
import { cn } from "@/lib/utils";

export interface DispatcherFleetStatusPanelProps {
  readonly className?: string;
}

export default function DispatcherFleetStatusPanel({
  className,
}: Readonly<DispatcherFleetStatusPanelProps>) {
  return (
    <IntegrationPendingState
      className={cn(
        "rounded-[1rem] bg-surface-container-lowest shadow-[0_24px_48px_-24px_rgba(6,78,59,0.16)]",
        className,
      )}
      title={adminScreenCopy.integrationPendingTitle}
      description={adminScreenCopy.integrationPendingDescription}
    />
  );
}

