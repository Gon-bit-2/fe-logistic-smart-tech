import TripDetailWorkspace from "@/features/trips/presentation/screens/TripDetailWorkspace";

export default async function DriverTripDetailPage(
  props: PageProps<"/[locale]/dashboard/driver/trips/[id]">,
) {
  const params = await props.params;
  return <TripDetailWorkspace tripId={params.id} />;
}
