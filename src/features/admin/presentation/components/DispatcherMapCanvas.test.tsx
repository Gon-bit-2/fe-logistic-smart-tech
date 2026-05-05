import { render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const markerInstances: Array<{
  addTo: ReturnType<typeof vi.fn>;
  remove: ReturnType<typeof vi.fn>;
  setLngLat: ReturnType<typeof vi.fn>;
}> = [];

vi.mock("next/script", async () => {
  const React = await import("react");

  return {
    default: function MockNextScript({
      onReady,
    }: {
      onReady?: () => void;
    }) {
      React.useEffect(() => {
        onReady?.();
      }, [onReady]);

      return null;
    },
  };
});

vi.mock("@/features/fleet/presentation/hooks/useFleetVehiclesQuery", () => ({
  useFleetVehiclesQuery: () => ({
    data: { totalItems: 2 },
    isLoading: false,
  }),
}));

vi.mock("@/features/orders/presentation/hooks/useOrdersListQuery", () => ({
  useOrdersListQuery: () => ({
    data: {
      data: [
        {
          customerName: "Công ty Emerald",
          reference: "ELG-2026-0001",
          senderLat: 10.728851,
          senderLng: 106.721659,
        },
      ],
    },
    isLoading: false,
  }),
}));

vi.mock("@/features/warehouses/presentation/hooks/useHubsQuery", () => ({
  useHubsQuery: () => ({
    data: {
      data: [
        {
          id: 1,
          latitude: 10.776889,
          longitude: 106.700806,
          name: "Tan Binh Hub",
        },
      ],
    },
    isLoading: false,
  }),
}));

describe("DispatcherMapCanvas", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_GOONG_MAPS_TILES_KEY", "test-goong-tile-key");
    markerInstances.length = 0;
    (window as Window & { goongjs?: unknown }).goongjs = {
      accessToken: "",
      Map: class {
        addControl = vi.fn();
        easeTo = vi.fn();
        fitBounds = vi.fn();
        on = vi.fn();
        remove = vi.fn();
        resize = vi.fn();
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
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    delete (window as Window & { goongjs?: unknown }).goongjs;
  });

  it("creates markers for hubs and pending orders when coordinates are available", async () => {
    const { default: DispatcherMapCanvas } = await import("./DispatcherMapCanvas");

    render(<DispatcherMapCanvas />);

    await waitFor(() => {
      expect(markerInstances).toHaveLength(2);
    });
  });
});
