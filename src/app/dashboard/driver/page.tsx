import InternalTrackingWorkspace from "@/features/tracking/components/InternalTrackingWorkspace";

export default async function DriverPage(props: PageProps<"/dashboard/driver">) {
  const searchParams = await props.searchParams;
  const orderId =
    typeof searchParams.orderId === "string" ? searchParams.orderId : undefined;

  return <InternalTrackingWorkspace orderId={orderId} />;
}
