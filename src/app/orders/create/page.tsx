import OrderCreationWorkspace from "@/features/orders/presentation/screens/OrderCreationWorkspace";
import CustomerShell from "@/components/layout/CustomerShell";

export default function OrderCreatePage() {
  return (
    <CustomerShell>
      <OrderCreationWorkspace showTopBar={false} />
    </CustomerShell>
  );
}
