import { IntegrationPendingState } from "@/components/ui/data-states";
import { PageHeader } from "@/features/admin/presentation/components/admin-primitives";
import { warehouseHubScreenCopy } from "@/i18n/vi";

export interface WarehouseHubManagementScreenProps {
  readonly _unused?: never;
}

export default function WarehouseHubManagementScreen(
  _props: Readonly<WarehouseHubManagementScreenProps>,
) {
  void _props;
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={warehouseHubScreenCopy.readyForInput}
        title={warehouseHubScreenCopy.pageTitle}
      />
      <IntegrationPendingState
        title={warehouseHubScreenCopy.pendingTitle}
        description={warehouseHubScreenCopy.pendingDescription}
      />
    </div>
  );
}

