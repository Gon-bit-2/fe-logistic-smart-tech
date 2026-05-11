import CheckoutScreen from "@/features/orders/presentation/screens/CheckoutScreen";
import CustomerShell from "@/components/layout/CustomerShell";

type CheckoutPageProps = {
  searchParams: Promise<{
    orderId?: string | string[];
    reference?: string | string[];
  }>;
};

function readSingleValue(value?: string | string[]) {
  return Array.isArray(value) ? (value[0] ?? null) : value ?? null;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;

  return (
    <CustomerShell>
      <CheckoutScreen
        orderId={readSingleValue(params.orderId)}
        reference={readSingleValue(params.reference)}
        showTopBar={false}
      />
    </CustomerShell>
  );
}
