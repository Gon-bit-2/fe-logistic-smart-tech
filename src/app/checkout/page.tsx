import { Suspense } from "react";
import CheckoutScreen from "@/features/orders/presentation/screens/CheckoutScreen";

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface px-6 py-12 text-on-surface">
          Loading checkout...
        </div>
      }
    >
      <CheckoutScreen />
    </Suspense>
  );
}
