import TrackingDetailScreen from "@/features/tracking/components/TrackingDetailScreen";

export default async function TrackingDetailPage(
  props: PageProps<"/tracking/[id]">,
) {
  const { id } = await props.params;

  return <TrackingDetailScreen orderId={id} />;
}
