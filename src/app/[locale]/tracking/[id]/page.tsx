import type { Metadata } from "next";
import TrackingDetailScreen from "@/features/tracking/presentation/screens/TrackingDetailScreen";

export async function generateMetadata(
  props: PageProps<"/[locale]/tracking/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  return {
    title: `Theo Dõi ${id} | Emerald Logistics`,
    description: `Theo dõi trạng thái đơn hàng ${id} theo thời gian thực.`,
  };
}

export default async function TrackingDetailPage(
  props: PageProps<"/[locale]/tracking/[id]">,
) {
  const { id } = await props.params;

  return <TrackingDetailScreen trackingCode={id} />;
}
