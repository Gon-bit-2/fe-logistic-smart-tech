import { Suspense } from "react";
import CheckoutScreen from "@/features/orders/presentation/screens/CheckoutScreen";
import CustomerShell from "@/components/layout/CustomerShell";

export default function CheckoutPage() {
  return (
    <CustomerShell>
      <Suspense
        fallback={
          <div className="mx-auto max-w-5xl px-6 py-12 text-on-surface md:px-8">
            Đang tải trang thanh toán...
          </div>
        }
      >
        <CheckoutScreen showTopBar={false} />
      </Suspense>
    </CustomerShell>
  );
}
