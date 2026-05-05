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
  type GoongRouteFeatureCollection,
  toGoongBounds,
} from "@/features/maps/presentation/lib/goong";
import { decodePolyline } from "@/features/orders/presentation/lib/polyline";
import { useI18nCopy } from "@/i18n/useCopy";
import { cn } from "@/lib/utils";

const DEFAULT_CENTER = { lat: 10.7769, lng: 106.7009 };
const ROUTE_SOURCE_ID = "order-route-preview-source";
const ROUTE_LAYER_ID = "order-route-preview-layer";

type OrderRoutePoint = {
  label: string;
  lat: number;
  lng: number;
};

export type OrderRouteMapProps = Readonly<{
  className?: string;
  delivery: OrderRoutePoint | null;
  error: string | null;
  isLoadingRoute: boolean;
  pickup: OrderRoutePoint | null;
  polyline: string | null;
}>;

function createRouteFeatureCollection(
  points: GoongCoordinate[],
): GoongRouteFeatureCollection {
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: points.map((point) => [point.lng, point.lat]),
        },
      },
    ],
  };
}

function removeRouteLayer(map: GoongMap) {
  if (map.getLayer?.(ROUTE_LAYER_ID)) {
    map.removeLayer?.(ROUTE_LAYER_ID);
  }

  if (map.getSource?.(ROUTE_SOURCE_ID)) {
    map.removeSource?.(ROUTE_SOURCE_ID);
  }
}

function syncRouteLayer(map: GoongMap, points: GoongCoordinate[]) {
  if (points.length < 2) {
    removeRouteLayer(map);
    return;
  }

  const data = createRouteFeatureCollection(points);
  const existingSource = map.getSource?.(ROUTE_SOURCE_ID);

  if (existingSource) {
    existingSource.setData(data);
  } else {
    map.addSource?.(ROUTE_SOURCE_ID, {
      type: "geojson",
      data,
    });
  }

  if (!map.getLayer?.(ROUTE_LAYER_ID)) {
    map.addLayer?.({
      id: ROUTE_LAYER_ID,
      type: "line",
      source: ROUTE_SOURCE_ID,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#6ee7b7",
        "line-opacity": 0.95,
        "line-width": 6,
      },
    });
  }
}

function createMapStateMessage(
  hasVisiblePoint: boolean,
  error: string | null,
  isLoadingRoute: boolean,
  routePreviewCopy: ReturnType<typeof useI18nCopy>["routePreviewCopy"],
): string | null {
  if (!hasVisiblePoint) {
    return routePreviewCopy.mapPendingDescription;
  }

  if (error) {
    return routePreviewCopy.quoteError;
  }

  if (isLoadingRoute) {
    return routePreviewCopy.mapLoadingDescription;
  }

  return null;
}

export default function OrderRouteMap({
  className,
  delivery,
  error,
  isLoadingRoute,
  pickup,
  polyline,
}: OrderRouteMapProps) {
  const { routePreviewCopy } = useI18nCopy();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<GoongMap | null>(null);
  const markerRefs = useRef<GoongMarker[]>([]);
  const [isScriptReady, setIsScriptReady] = useState(() =>
    Boolean(getGoongGlobal()),
  );
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const markerPoints = useMemo<GoongCoordinate[]>(
    () =>
      [pickup, delivery]
        .filter((point): point is OrderRoutePoint => point !== null)
        .map((point) => ({
          lat: point.lat,
          lng: point.lng,
        })),
    [delivery, pickup],
  );
  const routePoints = useMemo<GoongCoordinate[]>(
    () => (polyline ? decodePolyline(polyline) : []),
    [polyline],
  );
  const viewportPoints = routePoints.length >= 2 ? routePoints : markerPoints;
  const hasVisiblePoint = viewportPoints.length > 0;
  const mapStateMessage = createMapStateMessage(
    hasVisiblePoint,
    error,
    isLoadingRoute,
    routePreviewCopy,
  );

  useEffect(() => {
    ensureGoongCssLoaded();
  }, []);

  useEffect(() => {
    if (
      !isScriptReady ||
      !GOONG_MAPS_TILES_KEY ||
      !mapContainerRef.current ||
      mapRef.current ||
      !hasVisiblePoint
    ) {
      return;
    }

    const goong = getGoongGlobal();

    if (!goong) {
      queueMicrotask(() => {
        setMapError("Goong GL JS đã tải nhưng không khởi tạo được thư viện bản đồ.");
      });
      return;
    }

    try {
      goong.accessToken = GOONG_MAPS_TILES_KEY;

      const initialPoint = viewportPoints[0] ?? DEFAULT_CENTER;
      const map = new goong.Map({
        attributionControl: true,
        center: [initialPoint.lng, initialPoint.lat],
        container: mapContainerRef.current,
        style: GOONG_MAP_STYLE,
        zoom: hasVisiblePoint ? 12 : 11,
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
      setMapReady(true);
      requestAnimationFrame(() => {
        map.resize();
      });
    } catch (nextError) {
      queueMicrotask(() => {
        setMapError(getGoongMapsErrorMessage(nextError));
      });
    }
  }, [hasVisiblePoint, isScriptReady, viewportPoints]);

  useEffect(() => {
    const map = mapRef.current;
    const goong = getGoongGlobal();

    if (!mapReady || !map || !goong) {
      return;
    }

    markerRefs.current.forEach((marker) => marker.remove());
    markerRefs.current = [];

    if (pickup) {
      markerRefs.current.push(
        new goong.Marker({
          color: "#16a34a",
          scale: 1.05,
        })
          .setLngLat([pickup.lng, pickup.lat])
          .addTo(map),
      );
    }

    if (delivery) {
      markerRefs.current.push(
        new goong.Marker({
          color: "#0f766e",
          scale: 1.05,
        })
          .setLngLat([delivery.lng, delivery.lat])
          .addTo(map),
      );
    }

    return () => {
      markerRefs.current.forEach((marker) => marker.remove());
      markerRefs.current = [];
    };
  }, [delivery, mapReady, pickup]);

  useEffect(() => {
    const map = mapRef.current;

    if (!mapReady || !map) {
      return;
    }

    try {
      syncRouteLayer(map, routePoints);
    } catch (nextError) {
      queueMicrotask(() => {
        setMapError(getGoongMapsErrorMessage(nextError));
      });
    }
  }, [mapReady, routePoints]);

  useEffect(() => {
    const map = mapRef.current;

    if (!mapReady || !map || viewportPoints.length === 0) {
      return;
    }

    map.resize();
    if (viewportPoints.length > 1 && map.fitBounds) {
      const bounds = toGoongBounds(viewportPoints);

      if (bounds) {
        map.fitBounds(bounds, {
          duration: 600,
          maxZoom: routePoints.length >= 2 ? 13 : 14,
          padding: 52,
        });
        return;
      }
    }

    const point = viewportPoints[0];
    map.easeTo?.({
      center: [point.lng, point.lat],
      duration: 500,
      zoom: 13,
    });
  }, [mapReady, routePoints.length, viewportPoints]);

  useEffect(() => {
    if (hasVisiblePoint || !mapRef.current) {
      return;
    }

    removeRouteLayer(mapRef.current);
    mapRef.current.remove();
    mapRef.current = null;
    queueMicrotask(() => {
      setMapReady(false);
    });
  }, [hasVisiblePoint]);

  useEffect(() => {
    return () => {
      markerRefs.current.forEach((marker) => marker.remove());
      markerRefs.current = [];
      if (mapRef.current) {
        removeRouteLayer(mapRef.current);
      }
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  if (!GOONG_MAPS_TILES_KEY) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center px-8 text-center text-sm text-white/80",
          className,
        )}
      >
        Thiếu biến môi trường `NEXT_PUBLIC_GOONG_MAPS_TILES_KEY`.
      </div>
    );
  }

  if (mapError) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center px-8 text-center text-sm text-white/80",
          className,
        )}
      >
        {mapError}
      </div>
    );
  }

  if (!hasVisiblePoint) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center px-8 text-center text-sm text-white/80",
          className,
        )}
      >
        {mapStateMessage}
      </div>
    );
  }

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      {GOONG_MAPS_TILES_KEY && hasVisiblePoint ? (
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
      ) : null}

      <div
        ref={mapContainerRef}
        className="h-full w-full"
        data-testid="order-route-map"
      />

      {!polyline && mapStateMessage ? (
        <div className="absolute right-4 top-4 z-10 rounded-full border border-white/15 bg-black/25 px-3 py-1 text-[10px] font-black tracking-[0.14em] text-white uppercase backdrop-blur">
          {mapStateMessage}
        </div>
      ) : null}
    </div>
  );
}
