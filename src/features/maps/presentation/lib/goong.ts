"use client";

export const GOONG_GL_JS_SRC =
  "https://cdn.jsdelivr.net/npm/@goongmaps/goong-js@1.0.9/dist/goong-js.js";
export const GOONG_GL_CSS_HREF =
  "https://cdn.jsdelivr.net/npm/@goongmaps/goong-js@1.0.9/dist/goong-js.css";
export const GOONG_MAP_STYLE = "https://tiles.goong.io/assets/goong_map_web.json";
export const GOONG_MAPS_TILES_KEY = process.env.NEXT_PUBLIC_GOONG_MAPS_TILES_KEY;

export type GoongCoordinate = {
  lat: number;
  lng: number;
};

export type GoongBounds = [[number, number], [number, number]];

export type GoongRouteFeatureCollection = {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    properties: Record<string, never>;
    geometry: {
      type: "LineString";
      coordinates: number[][];
    };
  }>;
};

export type GoongGeoJsonSource = {
  setData: (data: GoongRouteFeatureCollection) => void;
};

export type GoongMap = {
  addControl: (control: unknown, position?: string) => void;
  addLayer?: (layer: {
    id: string;
    layout?: Record<string, unknown>;
    paint?: Record<string, unknown>;
    source: string;
    type: string;
  }) => void;
  addSource?: (
    id: string,
    source: {
      data: GoongRouteFeatureCollection;
      type: "geojson";
    },
  ) => void;
  easeTo?: (options: { center: [number, number]; duration?: number; zoom?: number }) => void;
  fitBounds?: (
    bounds: GoongBounds,
    options?: { duration?: number; maxZoom?: number; padding?: number },
  ) => void;
  getLayer?: (id: string) => unknown;
  getSource?: (id: string) => GoongGeoJsonSource | undefined;
  on?: (event: string, listener: (event: unknown) => void) => void;
  remove: () => void;
  removeLayer?: (id: string) => void;
  removeSource?: (id: string) => void;
  resize: () => void;
};

export type GoongMarker = {
  addTo: (map: GoongMap) => GoongMarker;
  remove: () => void;
  setLngLat: (lngLat: [number, number]) => GoongMarker;
};

export type GoongGlobal = {
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

export function ensureGoongCssLoaded() {
  if (typeof document === "undefined") {
    return;
  }

  if (process.env.NODE_ENV === "test") {
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

export function getGoongGlobal() {
  if (typeof window === "undefined") {
    return null;
  }

  return (window as Window & { goongjs?: GoongGlobal }).goongjs ?? null;
}

export function getGoongMapsErrorMessage(error: unknown) {
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

export function toGoongBounds(points: GoongCoordinate[]): GoongBounds | null {
  if (points.length === 0) {
    return null;
  }

  const latitudes = points.map((point) => point.lat);
  const longitudes = points.map((point) => point.lng);

  return [
    [Math.min(...longitudes), Math.min(...latitudes)],
    [Math.max(...longitudes), Math.max(...latitudes)],
  ];
}
