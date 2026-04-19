import OrderCreationWorkspace from "@/features/orders/presentation/screens/OrderCreationWorkspace";
import AuthGuard from "@/features/auth/presentation/components/AuthGuard";

export default function OrderCreatePage() {
  return (
    <AuthGuard>
      <OrderCreationWorkspace />
    </AuthGuard>
  );
}
