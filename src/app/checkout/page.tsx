import { Suspense } from "react";
import CheckoutScreen from "@/features/orders/presentation/screens/CheckoutScreen";
import AuthGuard from "@/features/auth/presentation/components/AuthGuard";

export default function CheckoutPage() {
  return (
    <AuthGuard>
      <Suspense
        fallback={
          <div className="min-h-screen bg-surface px-6 py-12 text-on-surface">
            Loading checkout...
          </div>
        }
      >
        <CheckoutScreen />
      </Suspense>
    </AuthGuard>
  );
}
