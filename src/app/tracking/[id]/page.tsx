import TrackingDetailScreen from "@/features/tracking/presentation/screens/TrackingDetailScreen";

export default async function TrackingDetailPage(
  props: PageProps<"/tracking/[id]">,
) {
  const { id } = await props.params;

  return <TrackingDetailScreen trackingCode={id} />;
}
