import { IntegrationPendingState } from "@/components/ui/data-states";
import { adminScreenCopy } from "@/i18n/vi";
import { cn } from "@/lib/utils";

export interface DispatcherMapCanvasProps {
  readonly className?: string;
}

export default function DispatcherMapCanvas({
  className,
}: Readonly<DispatcherMapCanvasProps>) {
  return (
    <IntegrationPendingState
      className={cn(
        "min-h-[18rem] rounded-[1rem] bg-surface-container-lowest md:min-h-[21rem] xl:min-h-[24rem]",
        className,
      )}
      title={adminScreenCopy.integrationPendingTitle}
      description={adminScreenCopy.integrationPendingDescription}
    />
  );
}

