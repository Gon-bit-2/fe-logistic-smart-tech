import type { Metadata } from "next";
import WarehouseOrderDetailScreen from "@/features/orders/presentation/screens/WarehouseOrderDetailScreen";

export async function generateMetadata(
  props: PageProps<"/[locale]/warehouse/orders/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;

  return {
    title: `Đơn ${id} | Warehouse Hub`,
    description: `Chi tiết vận hành nội bộ cho đơn hàng ${id}.`,
  };
}

export default async function WarehouseOrderDetailPage(
  props: PageProps<"/[locale]/warehouse/orders/[id]">,
) {
  const { id } = await props.params;

  return <WarehouseOrderDetailScreen orderId={id} />;
}
