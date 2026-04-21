"use client";

import { useMemo, useState } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { useFleetVehiclesQuery } from "@/features/fleet/presentation/hooks/useFleetVehiclesQuery";
import { useOrdersListQuery } from "@/features/orders/presentation/hooks/useOrdersListQuery";
import { useHubsQuery } from "@/features/warehouses/presentation/hooks/useHubsQuery";
import { cn } from "@/lib/utils";

// HCMC center fallback
const DEFAULT_CENTER = { lat: 10.7769, lng: 106.7009 };
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const GOOGLE_MAPS_MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID;

export interface DispatcherMapCanvasProps {
  readonly className?: string;
}

function MapFallback({
  className,
  title,
  description,
}: Readonly<{
  className?: string;
  title: string;
  description: string;
}>) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-center text-slate-600",
        className,
      )}
    >
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="max-w-md text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}

function getGoogleMapsErrorMessage(error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "Không thể tải Google Maps JavaScript API.";

  if (message.includes("ApiNotActivatedMapError")) {
    return "Google Maps API key đang hợp lệ nhưng dự án Google Cloud chưa bật Maps JavaScript API. Hãy bật API này cho đúng project và kiểm tra billing cùng HTTP referrer restrictions của key.";
  }

  return message;
}

export default function DispatcherMapCanvas({
  className,
}: Readonly<DispatcherMapCanvasProps>) {
  const [mapError, setMapError] = useState<string | null>(null);
  const { data: fleetData, isLoading: isFleetLoading } = useFleetVehiclesQuery({
    isActive: true,
  });
  const { data: orderData, isLoading: isOrderLoading } = useOrdersListQuery({
    status: "PENDING",
  });
  const { data: hubData, isLoading: isHubLoading } = useHubsQuery();

  const hubs = hubData?.data || [];
  const pendingOrders = orderData?.data || [];
  const totalVehicles = fleetData?.totalItems || fleetData?.data?.length || 0;

  const mapCenter = useMemo(() => {
    if (hubs.length > 0 && hubs[0].latitude && hubs[0].longitude) {
      return { lat: hubs[0].latitude, lng: hubs[0].longitude };
    }
    return DEFAULT_CENTER;
  }, [hubs]);

  if (isFleetLoading || isOrderLoading || isHubLoading) {
    return (
      <MapFallback
        className={className}
        title="Đang tải bản đồ điều phối..."
        description="Hệ thống đang đồng bộ trạng thái hubs, đơn hàng và đội xe."
      />
    );
  }

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <MapFallback
        className={className}
        title="Chưa cấu hình Google Maps"
        description="Thiếu biến môi trường NEXT_PUBLIC_GOOGLE_MAPS_API_KEY. Thêm key vào file .env ở thư mục gốc rồi khởi động lại ứng dụng."
      />
    );
  }

  if (mapError) {
    return (
      <MapFallback
        className={className}
        title="Không thể tải bản đồ điều phối"
        description={mapError}
      />
    );
  }

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      <APIProvider
        apiKey={GOOGLE_MAPS_API_KEY}
        onError={(error) => {
          setMapError(getGoogleMapsErrorMessage(error));
        }}
      >
        <Map
          defaultCenter={mapCenter}
          defaultZoom={11}
          mapId={GOOGLE_MAPS_MAP_ID}
          disableDefaultUI={true}
          gestureHandling="greedy"
        >
          {/* Hub Markers */}
          {hubs.map((hub) => {
            if (
              typeof hub.latitude !== "number" ||
              typeof hub.longitude !== "number"
            )
              return null;
            return (
              <Marker
                key={`hub-${hub.id}`}
                position={{ lat: hub.latitude, lng: hub.longitude }}
                title={hub.name}
              />
            );
          })}

          {/* Pending Order Markers */}
          {pendingOrders.map((order) => {
            // we do not have lat/lng on the order object model currently
            // will just skip rendering orders on map for now
            return null;
          })}
        </Map>
      </APIProvider>

      {/* Overlay Stats */}
      <div className="absolute top-4 left-4 z-10 flex gap-2 flex-wrap">
        <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded text-xs font-semibold shadow-sm border border-slate-200 flex items-center text-slate-700">
          <span className="w-2 h-2 inline-block rounded-full bg-[#064e3b] mr-2"></span>
          <span className="font-bold mr-1 text-[#064E3B]">{hubs.length}</span>{" "}
          Hubs
        </div>
        <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded text-xs font-semibold shadow-sm border border-slate-200 flex items-center text-slate-700">
          <span className="w-2 h-2 inline-block rounded-full bg-amber-500 mr-2"></span>
          <span className="font-bold mr-1 text-amber-600">
            {pendingOrders.length}
          </span>{" "}
          Đơn chờ
        </div>
        <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded text-xs font-semibold shadow-sm border border-slate-200 flex items-center text-slate-700">
          <span className="w-2 h-2 inline-block rounded-full bg-[#10B981] mr-2"></span>
          <span className="font-bold mr-1 text-[#10B981]">{totalVehicles}</span>{" "}
          Xe sẵn sàng
        </div>
      </div>
    </div>
  );
}
