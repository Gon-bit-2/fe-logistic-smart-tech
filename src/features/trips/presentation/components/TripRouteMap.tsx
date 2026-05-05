"use client";

import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ensureGoongCssLoaded,
  getGoongGlobal,
  getGoongMapsErrorMessage,
  GOONG_GL_JS_SRC,
  GOONG_MAPS_TILES_KEY,
  GOONG_MAP_STYLE,
  type GoongCoordinate,
  type GoongMap,
  type GoongMarker,
  toGoongBounds,
} from "@/features/maps/presentation/lib/goong";
import type { TripStopDetail } from "@/features/trips/domain/types/trip.types";
import { decodePolyline } from "@/features/orders/presentation/lib/polyline";
import { cn } from "@/lib/utils";

const DEFAULT_CENTER = { lat: 10.7769, lng: 106.7009 };
const ROUTE_SOURCE_ID = "trip-route";
const ROUTE_LAYER_ID = "trip-route-line";

type TripRouteMapProps = {
  className?: string;
  currentLocation?: GoongCoordinate | null;
  polyline?: string | null;
  stops: TripStopDetail[];
};

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

export default function TripRouteMap({
  className,
  currentLocation,
  polyline,
  stops,
}: Readonly<TripRouteMapProps>) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<GoongMap | null>(null);
  const markerRef = useRef<GoongMarker[]>([]);
  const liveMarkerRef = useRef<GoongMarker | null>(null);
  const [isScriptReady, setIsScriptReady] = useState(() =>
    Boolean(getGoongGlobal()),
  );
  const [mapError, setMapError] = useState<string | null>(null);

  const routePoints = useMemo<GoongCoordinate[]>(() => {
    if (polyline) {
      return decodePolyline(polyline);
    }

    return stops
      .map((stop) => {
        if (stop.stopType === "PICKUP" && stop.order?.senderLat != null && stop.order?.senderLng != null) {
          return {
            lat: stop.order.senderLat,
            lng: stop.order.senderLng,
          };
        }

        if (stop.stopType === "HUB_TRANSFER" && stop.hub?.latitude != null && stop.hub?.longitude != null) {
          return {
            lat: stop.hub.latitude,
            lng: stop.hub.longitude,
          };
        }

        if (stop.order?.receiverLat != null && stop.order?.receiverLng != null) {
          return {
            lat: stop.order.receiverLat,
            lng: stop.order.receiverLng,
          };
        }

        return null;
      })
      .filter((point): point is GoongCoordinate => point !== null);
  }, [polyline, stops]);

  const mapCenter = useMemo(() => {
    const visiblePoints = currentLocation
      ? [...routePoints, currentLocation]
      : routePoints;

    if (visiblePoints.length === 0) {
      return DEFAULT_CENTER;
    }

    const latSum = visiblePoints.reduce((sum, point) => sum + point.lat, 0);
    const lngSum = visiblePoints.reduce((sum, point) => sum + point.lng, 0);

    return {
      lat: latSum / visiblePoints.length,
      lng: lngSum / visiblePoints.length,
    };
  }, [currentLocation, routePoints]);

  useEffect(() => {
    ensureGoongCssLoaded();
  }, []);

  useEffect(() => {
    if (!isScriptReady || !GOONG_MAPS_TILES_KEY || !mapContainerRef.current || mapRef.current) {
      return;
    }

    const goong = getGoongGlobal();

    if (!goong) {
      queueMicrotask(() => {
        setMapError("Goong GL JS đã tải nhưng chưa khởi tạo được thư viện bản đồ.");
      });
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
      queueMicrotask(() => {
        setMapError(getGoongMapsErrorMessage(error));
      });
    }
  }, [isScriptReady, mapCenter.lat, mapCenter.lng]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    map.resize();
    const visiblePoints = currentLocation
      ? [...routePoints, currentLocation]
      : routePoints;
    const bounds = toGoongBounds(visiblePoints);
    if (bounds && visiblePoints.length > 1) {
      map.fitBounds?.(bounds, {
        duration: 500,
        maxZoom: 13,
        padding: 44,
      });
      return;
    }

      map.easeTo?.({
      center: [mapCenter.lng, mapCenter.lat],
      duration: 400,
      zoom: visiblePoints.length > 0 ? 12 : 10,
    });
  }, [currentLocation, mapCenter.lat, mapCenter.lng, routePoints]);

  useEffect(() => {
    const map = mapRef.current;
    const goong = getGoongGlobal();

    if (!map || !goong) {
      return;
    }

    markerRef.current.forEach((marker) => marker.remove());
    markerRef.current = routePoints.map((point, index) =>
      new goong.Marker({
        color: index === 0 ? "#0f766e" : index === routePoints.length - 1 ? "#dc2626" : "#0f172a",
        scale: index === 0 || index === routePoints.length - 1 ? 1.15 : 0.95,
      })
        .setLngLat([point.lng, point.lat])
        .addTo(map),
    );

    return () => {
      markerRef.current.forEach((marker) => marker.remove());
      markerRef.current = [];
    };
  }, [routePoints]);

  useEffect(() => {
    const map = mapRef.current;
    const goong = getGoongGlobal();

    if (!map || !goong) {
      return;
    }

    liveMarkerRef.current?.remove();
    liveMarkerRef.current = null;

    if (!currentLocation) {
      return;
    }

    liveMarkerRef.current = new goong.Marker({
      color: "#2563eb",
      scale: 1.25,
    })
      .setLngLat([currentLocation.lng, currentLocation.lat])
      .addTo(map);

    return () => {
      liveMarkerRef.current?.remove();
      liveMarkerRef.current = null;
    };
  }, [currentLocation]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || routePoints.length < 2 || !map.addSource || !map.addLayer || !map.getSource) {
      return;
    }

    const routeData = {
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          properties: {},
          geometry: {
            type: "LineString" as const,
            coordinates: routePoints.map((point) => [point.lng, point.lat]),
          },
        },
      ],
    };

    const existingSource = map.getSource(ROUTE_SOURCE_ID);
    if (existingSource) {
      existingSource.setData(routeData);
      return;
    }

    map.addSource(ROUTE_SOURCE_ID, {
      data: routeData,
      type: "geojson",
    });
    map.addLayer({
      id: ROUTE_LAYER_ID,
      type: "line",
      source: ROUTE_SOURCE_ID,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#0f766e",
        "line-opacity": 0.75,
        "line-width": 4,
      },
    });
  }, [routePoints]);

  useEffect(() => {
    return () => {
      markerRef.current.forEach((marker) => marker.remove());
      markerRef.current = [];
      liveMarkerRef.current?.remove();
      liveMarkerRef.current = null;
      if (mapRef.current?.getLayer?.(ROUTE_LAYER_ID) && mapRef.current.removeLayer) {
        mapRef.current.removeLayer(ROUTE_LAYER_ID);
      }
      if (mapRef.current?.getSource?.(ROUTE_SOURCE_ID) && mapRef.current.removeSource) {
        mapRef.current.removeSource(ROUTE_SOURCE_ID);
      }
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className={cn("relative h-full min-h-[320px] overflow-hidden rounded-3xl", className)}>
      {GOONG_MAPS_TILES_KEY ? (
        <Script
          src={GOONG_GL_JS_SRC}
          strategy="afterInteractive"
          onError={() => setMapError("Không thể tải Goong GL JS từ CDN.")}
          onLoad={() => setIsScriptReady(true)}
          onReady={() => setIsScriptReady(true)}
        />
      ) : null}

      {!GOONG_MAPS_TILES_KEY ? (
        <MapFallback
          className="absolute inset-0 z-20"
          title="Chưa cấu hình Goong Maps"
          description="Thiếu NEXT_PUBLIC_GOONG_MAPS_TILES_KEY nên hệ thống chỉ hiển thị danh sách điểm dừng ở panel bên cạnh."
        />
      ) : mapError ? (
        <MapFallback
          className="absolute inset-0 z-20"
          title="Không thể tải tuyến đường"
          description={mapError}
        />
      ) : null}

      <div ref={mapContainerRef} className="h-full w-full" />
    </div>
  );
}
