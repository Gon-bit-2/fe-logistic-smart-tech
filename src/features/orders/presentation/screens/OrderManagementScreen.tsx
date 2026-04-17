import { IntegrationPendingState } from "@/components/ui/data-states";
import { PageHeader } from "@/features/admin/presentation/components/admin-primitives";
import { orderManagementCopy } from "@/i18n/vi";

export interface OrderManagementScreenProps {
  readonly _unused?: never;
}

export default function OrderManagementScreen(
  _props: Readonly<OrderManagementScreenProps>,
) {
  void _props;
  return (
    <div className="space-y-8">
      <PageHeader
        title={orderManagementCopy.title}
        description={orderManagementCopy.description}
      />
      <IntegrationPendingState
        title={orderManagementCopy.title}
        description="Màn quản lý đơn hàng chi tiết chưa được mount vào route hiện tại và không còn dùng dữ liệu mô phỏng cũ."
      />
    </div>
  );
}

