import { render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mapInstances: Array<{
  addControl: ReturnType<typeof vi.fn>;
  addLayer: ReturnType<typeof vi.fn>;
  addSource: ReturnType<typeof vi.fn>;
  easeTo: ReturnType<typeof vi.fn>;
  fitBounds: ReturnType<typeof vi.fn>;
  getLayer: ReturnType<typeof vi.fn>;
  getSource: ReturnType<typeof vi.fn>;
  on: ReturnType<typeof vi.fn>;
  remove: ReturnType<typeof vi.fn>;
  removeLayer: ReturnType<typeof vi.fn>;
  removeSource: ReturnType<typeof vi.fn>;
  resize: ReturnType<typeof vi.fn>;
  sources: Map<string, { setData: ReturnType<typeof vi.fn> }>;
} > = [];
const markerInstances: Array<{
  addTo: ReturnType<typeof vi.fn>;
  remove: ReturnType<typeof vi.fn>;
  setLngLat: ReturnType<typeof vi.fn>;
}> = [];

vi.mock("next/script", async () => {
  const React = await import("react");

  return {
    default: ({
      onReady,
    }: {
      onReady?: () => void;
    }) => {
      React.useEffect(() => {
        onReady?.();
      }, [onReady]);

      return null;
    },
  };
});

function installGoongMock() {
  markerInstances.length = 0;
  mapInstances.length = 0;

  (window as Window & { goongjs?: unknown }).goongjs = {
    accessToken: "",
    Map: class {
      addControl = vi.fn();
      addLayer = vi.fn((layer: { id: string }) => {
        this.layers.add(layer.id);
      });
      addSource = vi.fn((id: string) => {
        this.sources.set(id, { setData: vi.fn() });
      });
      easeTo = vi.fn();
      fitBounds = vi.fn();
      getLayer = vi.fn((id: string) => (this.layers.has(id) ? { id } : undefined));
      getSource = vi.fn((id: string) => this.sources.get(id));
      layers = new Set<string>();
      on = vi.fn();
      remove = vi.fn();
      removeLayer = vi.fn((id: string) => {
        this.layers.delete(id);
      });
      removeSource = vi.fn((id: string) => {
        this.sources.delete(id);
      });
      resize = vi.fn();
      sources = new Map<string, { setData: ReturnType<typeof vi.fn> }>();

      constructor() {
        mapInstances.push(this);
      }
    },
    Marker: class {
      addTo = vi.fn(function (this: typeof markerInstances[number]) {
        return this;
      });
      remove = vi.fn();
      setLngLat = vi.fn(function (this: typeof markerInstances[number]) {
        return this;
      });

      constructor() {
        markerInstances.push(this);
      }
    },
    NavigationControl: class {},
  };
}

const pickup = {
  label: "123 Nguyen Van Linh, Quan 7",
  lat: 10.728851,
  lng: 106.721659,
};

const delivery = {
  label: "456 Dien Bien Phu, Binh Thanh",
  lat: 10.80035,
  lng: 106.71482,
};

describe("OrderRouteMap", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_GOONG_MAPS_TILES_KEY", "test-goong-tile-key");
    installGoongMock();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    delete (window as Window & { goongjs?: unknown }).goongjs;
  });

  it("shows a configuration fallback when the Goong tiles key is missing", async () => {
    vi.unstubAllEnvs();
    vi.resetModules();

    const { default: OrderRouteMap } = await import("./OrderRouteMap");

    const { getByText } = render(
      <OrderRouteMap
        pickup={pickup}
        delivery={delivery}
        polyline={null}
        isLoadingRoute={false}
        error={null}
      />,
    );

    expect(
      getByText(/NEXT_PUBLIC_GOONG_MAPS_TILES_KEY/i),
    ).toBeInTheDocument();
  });

  it("creates markers and a route layer when polyline data is available", async () => {
    const { default: OrderRouteMap } = await import("./OrderRouteMap");

    render(
      <OrderRouteMap
        pickup={pickup}
        delivery={delivery}
        polyline="_p~iF~ps|U_ulLnnqC_mqNvxq`@"
        isLoadingRoute={false}
        error={null}
      />,
    );

    await waitFor(() => {
      expect(mapInstances).toHaveLength(1);
      expect(markerInstances).toHaveLength(2);
      expect(mapInstances[0]?.addSource).toHaveBeenCalledWith(
        "order-route-preview-source",
        expect.objectContaining({
          type: "geojson",
        }),
      );
      expect(mapInstances[0]?.addLayer).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "order-route-preview-layer",
          source: "order-route-preview-source",
          type: "line",
        }),
      );
    });
  });

  it("removes the route overlay and markers during updates and unmount", async () => {
    const { default: OrderRouteMap } = await import("./OrderRouteMap");

    const view = render(
      <OrderRouteMap
        pickup={pickup}
        delivery={delivery}
        polyline="_p~iF~ps|U_ulLnnqC_mqNvxq`@"
        isLoadingRoute={false}
        error={null}
      />,
    );

    await waitFor(() => {
      expect(mapInstances[0]?.addSource).toHaveBeenCalled();
    });

    view.rerender(
      <OrderRouteMap
        pickup={pickup}
        delivery={delivery}
        polyline={null}
        isLoadingRoute={false}
        error={null}
      />,
    );

    await waitFor(() => {
      expect(mapInstances[0]?.removeLayer).toHaveBeenCalledWith(
        "order-route-preview-layer",
      );
      expect(mapInstances[0]?.removeSource).toHaveBeenCalledWith(
        "order-route-preview-source",
      );
    });

    view.unmount();

    expect(mapInstances[0]?.remove).toHaveBeenCalled();
    expect(markerInstances.some((marker) => marker.remove.mock.calls.length > 0)).toBe(
      true,
    );
  });
});
