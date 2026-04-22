"use client";

import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFleetVehiclesQuery } from "@/features/fleet/presentation/hooks/useFleetVehiclesQuery";
import { useOrdersListQuery } from "@/features/orders/presentation/hooks/useOrdersListQuery";
import { useHubsQuery } from "@/features/warehouses/presentation/hooks/useHubsQuery";
import { cn } from "@/lib/utils";

const DEFAULT_CENTER = { lat: 10.7769, lng: 106.7009 };
const GOONG_GL_JS_SRC =
  "https://cdn.jsdelivr.net/npm/@goongmaps/goong-js@1.0.9/dist/goong-js.js";
const GOONG_GL_CSS_HREF =
  "https://cdn.jsdelivr.net/npm/@goongmaps/goong-js@1.0.9/dist/goong-js.css";
const GOONG_MAP_STYLE = "https://tiles.goong.io/assets/goong_map_web.json";
const GOONG_MAPS_TILES_KEY = process.env.NEXT_PUBLIC_GOONG_MAPS_TILES_KEY;

type Coordinate = {
  lat: number;
  lng: number;
};

type GoongMap = {
  addControl: (control: unknown, position?: string) => void;
  easeTo?: (options: { center: [number, number]; duration?: number; zoom?: number }) => void;
  fitBounds?: (
    bounds: [[number, number], [number, number]],
    options?: { duration?: number; maxZoom?: number; padding?: number },
  ) => void;
  on?: (event: string, listener: (event: unknown) => void) => void;
  remove: () => void;
  resize: () => void;
};

type GoongMarker = {
  addTo: (map: GoongMap) => GoongMarker;
  remove: () => void;
  setLngLat: (lngLat: [number, number]) => GoongMarker;
};

type GoongGlobal = {
  accessToken: string;
  Map: new (options: {
    attributionControl?: boolean;
    center: [number, number];
    container: HTMLElement;
    style: string;
    zoom: number;
  }) => GoongMap;
  Marker: new (options?: { color?: string; scale?: number }) => GoongMarker;
  NavigationControl: new (options?: {
    showCompass?: boolean;
    showZoom?: boolean;
    visualizePitch?: boolean;
  }) => unknown;
};

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

function ensureGoongCssLoaded() {
  if (typeof document === "undefined") {
    return;
  }

  if (document.getElementById("goong-gl-css")) {
    return;
  }

  const link = document.createElement("link");
  link.id = "goong-gl-css";
  link.rel = "stylesheet";
  link.href = GOONG_GL_CSS_HREF;
  document.head.appendChild(link);
}

function getGoongGlobal() {
  if (typeof window === "undefined") {
    return null;
  }

  return (window as Window & { goongjs?: GoongGlobal }).goongjs ?? null;
}

function getGoongMapsErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "error" in error) {
    return getGoongMapsErrorMessage((error as { error?: unknown }).error);
  }

  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "Không thể tải Goong map.";

  if (message.includes("401") || message.includes("403")) {
    return "Goong map tiles key không hợp lệ hoặc domain hiện tại chưa được whitelist đúng trong Goong.";
  }

  if (message.includes("429")) {
    return "Goong map đang bị giới hạn lượt tải. Hãy kiểm tra quota của map tiles key.";
  }

  return message;
}

export default function DispatcherMapCanvas({
  className,
}: Readonly<DispatcherMapCanvasProps>) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<GoongMap | null>(null);
  const hubMarkersRef = useRef<GoongMarker[]>([]);
  const orderMarkersRef = useRef<GoongMarker[]>([]);
  const [isScriptReady, setIsScriptReady] = useState(false);
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
  const mapPoints = useMemo<Coordinate[]>(() => {
    const hubPoints = hubs
      .filter(
        (hub) =>
          typeof hub.latitude === "number" && typeof hub.longitude === "number",
      )
      .map((hub) => ({
        lat: hub.latitude!,
        lng: hub.longitude!,
      }));
    const orderPoints = pendingOrders
      .map((order) => {
        if (typeof order.senderLat === "number" && typeof order.senderLng === "number") {
          return {
            lat: order.senderLat,
            lng: order.senderLng,
          };
        }

        if (
          typeof order.receiverLat === "number" &&
          typeof order.receiverLng === "number"
        ) {
          return {
            lat: order.receiverLat,
            lng: order.receiverLng,
          };
        }

        return null;
      })
      .filter((point): point is Coordinate => point !== null);

    return [...hubPoints, ...orderPoints];
  }, [hubs, pendingOrders]);

  const mapCenter = useMemo(() => {
    if (mapPoints.length > 0) {
      const latitudeSum = mapPoints.reduce((sum, point) => sum + point.lat, 0);
      const longitudeSum = mapPoints.reduce((sum, point) => sum + point.lng, 0);
      return {
        lat: latitudeSum / mapPoints.length,
        lng: longitudeSum / mapPoints.length,
      };
    }

    return DEFAULT_CENTER;
  }, [mapPoints]);

  useEffect(() => {
    ensureGoongCssLoaded();
  }, []);

  useEffect(() => {
    if (!isScriptReady || !GOONG_MAPS_TILES_KEY || !mapContainerRef.current || mapRef.current) {
      return;
    }

    const goong = getGoongGlobal();

    if (!goong) {
      setMapError("Goong GL JS đã tải nhưng không khởi tạo được thư viện bản đồ.");
      return;
    }

    try {
      goong.accessToken = GOONG_MAPS_TILES_KEY;

      const map = new goong.Map({
        attributionControl: true,
        center: [mapCenter.lng, mapCenter.lat],
        container: mapContainerRef.current,
        style: GOONG_MAP_STYLE,
        zoom: 11,
      });

      map.addControl(
        new goong.NavigationControl({
          showCompass: false,
          showZoom: true,
        }),
        "top-right",
      );
      map.on?.("error", (event) => {
        setMapError(getGoongMapsErrorMessage(event));
      });

      mapRef.current = map;
      requestAnimationFrame(() => {
        map.resize();
      });
    } catch (error) {
      setMapError(getGoongMapsErrorMessage(error));
    }
  }, [isScriptReady, mapCenter.lat, mapCenter.lng]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    map.resize();
    if (mapPoints.length > 1 && map.fitBounds) {
      const latitudes = mapPoints.map((point) => point.lat);
      const longitudes = mapPoints.map((point) => point.lng);
      map.fitBounds(
        [
          [Math.min(...longitudes), Math.min(...latitudes)],
          [Math.max(...longitudes), Math.max(...latitudes)],
        ],
        {
          duration: 600,
          maxZoom: 12,
          padding: 48,
        },
      );
      return;
    }

    map.easeTo?.({
      center: [mapCenter.lng, mapCenter.lat],
      duration: 500,
      zoom: mapPoints.length === 1 ? 12 : 11,
    });
  }, [mapCenter.lat, mapCenter.lng, mapPoints]);

  useEffect(() => {
    const map = mapRef.current;
    const goong = getGoongGlobal();

    if (!map || !goong) {
      return;
    }

    hubMarkersRef.current.forEach((marker) => marker.remove());
    hubMarkersRef.current = hubs
      .filter(
        (hub) =>
          typeof hub.latitude === "number" && typeof hub.longitude === "number",
      )
      .map((hub) =>
        new goong.Marker({
          color: "#064E3B",
          scale: 1.15,
        })
          .setLngLat([hub.longitude!, hub.latitude!])
          .addTo(map),
      );

    return () => {
      hubMarkersRef.current.forEach((marker) => marker.remove());
      hubMarkersRef.current = [];
    };
  }, [hubs]);

  useEffect(() => {
    const map = mapRef.current;
    const goong = getGoongGlobal();

    if (!map || !goong) {
      return;
    }

    orderMarkersRef.current.forEach((marker) => marker.remove());
    orderMarkersRef.current = pendingOrders
      .map((order) => {
        if (typeof order.senderLat === "number" && typeof order.senderLng === "number") {
          return {
            lat: order.senderLat,
            lng: order.senderLng,
            title: `${order.reference} • ${order.customerName}`,
          };
        }

        if (
          typeof order.receiverLat === "number" &&
          typeof order.receiverLng === "number"
        ) {
          return {
            lat: order.receiverLat,
            lng: order.receiverLng,
            title: `${order.reference} • ${order.customerName}`,
          };
        }

        return null;
      })
      .filter((point): point is Coordinate & { title: string } => point !== null)
      .map((point) =>
        new goong.Marker({
          color: "#f59e0b",
          scale: 1,
        })
          .setLngLat([point.lng, point.lat])
          .addTo(map),
      );

    return () => {
      orderMarkersRef.current.forEach((marker) => marker.remove());
      orderMarkersRef.current = [];
    };
  }, [pendingOrders]);

  useEffect(() => {
    return () => {
      hubMarkersRef.current.forEach((marker) => marker.remove());
      hubMarkersRef.current = [];
      orderMarkersRef.current.forEach((marker) => marker.remove());
      orderMarkersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  if (isFleetLoading || isOrderLoading || isHubLoading) {
    return (
      <MapFallback
        className={className}
        title="Đang tải bản đồ điều phối..."
        description="Hệ thống đang đồng bộ trạng thái hubs, đơn hàng và đội xe."
      />
    );
  }

  if (!GOONG_MAPS_TILES_KEY) {
    return (
      <MapFallback
        className={className}
        title="Chưa cấu hình Goong Maps"
        description="Thiếu biến môi trường NEXT_PUBLIC_GOONG_MAPS_TILES_KEY. Thêm map tiles key vào file .env ở thư mục gốc rồi khởi động lại ứng dụng."
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
      <Script
        src={GOONG_GL_JS_SRC}
        strategy="afterInteractive"
        onError={() => {
          setMapError("Không thể tải Goong GL JS từ CDN.");
        }}
        onReady={() => {
          setIsScriptReady(true);
        }}
      />

      <div ref={mapContainerRef} className="h-full w-full" />

      <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
        <div className="flex items-center rounded border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-sm">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#064e3b]"></span>
          <span className="mr-1 font-bold text-[#064E3B]">{hubs.length}</span>
          Hubs
        </div>
        <div className="flex items-center rounded border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-sm">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-amber-500"></span>
          <span className="mr-1 font-bold text-amber-600">
            {pendingOrders.length}
          </span>
          Đơn chờ
        </div>
        <div className="flex items-center rounded border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-sm">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#10B981]"></span>
          <span className="mr-1 font-bold text-[#10B981]">{totalVehicles}</span>
          Xe sẵn sàng
        </div>
      </div>
    </div>
  );
}
