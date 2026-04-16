import HubMap from "@/features/fleet/components/HubMap";
import VehicleList from "@/features/fleet/components/VehicleList";
import CO2Dashboard from "@/features/green-tech/components/CO2Dashboard";
import OrderForm from "@/features/orders/components/OrderForm";
import OrderTimeline from "@/features/orders/components/OrderTimeline";
import type { OrderDTO } from "@/features/orders/types/order.dto";

const adminOrder: OrderDTO = {
  id: "ord-admin-001",
  reference: "EL-240315",
  customerName: "Green Retail Co.",
  pickupAddress: "Thu Duc Hub, Ho Chi Minh City",
  deliveryAddress: "District 7 Distribution Center",
  estimatedArrival: new Date(Date.now() + 80 * 60 * 1000).toISOString(),
  co2SavedKg: 42,
  status: "IN_TRANSIT",
  stops: [
    {
      id: "stop-1",
      label: "Pickup complete",
      location: "Thu Duc Hub, Ho Chi Minh City",
      status: "completed",
      timestamp: new Date().toISOString(),
    },
    {
      id: "stop-2",
      label: "Sorting center",
      location: "Bien Hoa Depot",
      status: "current",
      timestamp: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    },
    {
      id: "stop-3",
      label: "Final delivery",
      location: "District 7 Distribution Center",
      status: "pending",
      timestamp: new Date(Date.now() + 80 * 60 * 1000).toISOString(),
    },
  ],
};

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-black tracking-[0.3em] text-primary uppercase">
          Admin
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-on-surface">
          Smart logistics control tower
        </h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <OrderForm />
        <CO2Dashboard />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <OrderTimeline order={adminOrder} />
        <VehicleList />
      </div>

      <HubMap />
    </div>
  );
}
