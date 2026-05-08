import { notFound } from "next/navigation";
import AdminOrderDetailScreen from "@/features/orders/presentation/screens/AdminOrderDetailScreen";

type AdminOrderDetailPageProps = Readonly<{
  params:
    | Promise<{
        id?: string;
      }>
    | {
        id?: string;
      };
}>;

export default async function AdminOrderDetailPage({
  params,
}: AdminOrderDetailPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id?.trim();

  if (!id) {
    notFound();
  }

  return <AdminOrderDetailScreen orderId={id} />;
}
