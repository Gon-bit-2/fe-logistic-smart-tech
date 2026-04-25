import { screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createEmptyOrderInput } from "@/features/orders/domain/value-objects/order-form";
import { renderWithProviders } from "@/test/render";

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

  (window as Window & { goongjs?: unknown }).goongjs = {
    accessToken: "",
    Map: class {
      addControl = vi.fn();
      addLayer = vi.fn();
      addSource = vi.fn();
      easeTo = vi.fn();
      fitBounds = vi.fn();
      getLayer = vi.fn(() => undefined);
      getSource = vi.fn(() => undefined);
      on = vi.fn();
      remove = vi.fn();
      removeLayer = vi.fn();
      removeSource = vi.fn();
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
}

describe("RoutePreviewCard", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_GOONG_MAPS_TILES_KEY", "test-goong-tile-key");
    installGoongMock();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    delete (window as Window & { goongjs?: unknown }).goongjs;
  });

  it("renders the Goong map with backend quote values and resolved addresses", async () => {
    const { default: RoutePreviewCard } = await import("./RoutePreviewCard");

    const form = {
      ...createEmptyOrderInput(),
      customerName: "Công ty Emerald",
      declaredValueUsd: 150,
      delivery: {
        address: "456 Điện Biên Phủ, Bình Thạnh",
        isResolved: true,
        latitude: 10.80035,
        longitude: 106.71482,
        placeId: "delivery-place",
        query: "456 Điện Biên Phủ, Bình Thạnh",
      },
      estimatedArrival: "2026-04-21T10:30:00.000Z",
      itemDescription: "Thiết bị điện tử",
      packageDimensions: "40x30x20",
      packageWeightKg: 25,
      pickup: {
        address: "123 Nguyễn Văn Linh, Quận 7",
        isResolved: true,
        latitude: 10.728851,
        longitude: 106.721659,
        placeId: "pickup-place",
        query: "123 Nguyễn Văn Linh, Quận 7",
      },
      serviceTier: "eco_green" as const,
    };

    renderWithProviders(
      <RoutePreviewCard
        form={form}
        quoteState={{
          canRequestQuote: true,
          canSubmit: true,
          error: null,
          isLoading: false,
          isRefreshing: false,
          quote: {
            quote: {
              currency: "VND",
              distanceKm: 5.2,
              durationSeconds: 1200,
              estimatedCo2Saved: 0.0625,
              shippingFee: 42500,
              totalVolume: 0.006,
              totalWeight: 0.6,
            },
            routes: [
              {
                distanceMeters: 5200,
                distanceText: "5.2 km",
                durationSeconds: 1200,
                durationText: "20 mins",
                polyline: "_p~iF~ps|U_ulLnnqC_mqNvxq`@",
              },
            ],
          },
          validationMessage: null,
        }}
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId("order-route-map")).toBeInTheDocument();
      expect(markerInstances).toHaveLength(2);
    });

    expect(screen.getByText("123 Nguyễn Văn Linh, Quận 7")).toBeInTheDocument();
    expect(screen.getByText("456 Điện Biên Phủ, Bình Thạnh")).toBeInTheDocument();
    expect(screen.getByText(/42.500/)).toBeInTheDocument();
    expect(screen.getByText("5.2 km")).toBeInTheDocument();
    expect(screen.getByText("20 mins")).toBeInTheDocument();
  });

  it("keeps the live map visible with markers before route polyline is available", async () => {
    const { default: RoutePreviewCard } = await import("./RoutePreviewCard");

    const form = {
      ...createEmptyOrderInput(),
      delivery: {
        address: "456 Điện Biên Phủ, Bình Thạnh",
        isResolved: true,
        latitude: 10.80035,
        longitude: 106.71482,
        placeId: "delivery-place",
        query: "456 Điện Biên Phủ, Bình Thạnh",
      },
      packageWeightKg: 12,
      pickup: {
        address: "123 Nguyễn Văn Linh, Quận 7",
        isResolved: true,
        latitude: 10.728851,
        longitude: 106.721659,
        placeId: "pickup-place",
        query: "123 Nguyễn Văn Linh, Quận 7",
      },
    };

    renderWithProviders(
      <RoutePreviewCard
        form={form}
        quoteState={{
          canRequestQuote: true,
          canSubmit: false,
          error: null,
          isLoading: false,
          isRefreshing: false,
          quote: null,
          validationMessage: null,
        }}
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId("order-route-map")).toBeInTheDocument();
      expect(markerInstances).toHaveLength(2);
    });

    expect(
      screen.queryByText(/Bản đồ đang hiển thị các điểm dừng thực tế/i),
    ).not.toBeInTheDocument();
  });

  it("shows the pending map message when no address has been resolved", async () => {
    const { default: RoutePreviewCard } = await import("./RoutePreviewCard");

    renderWithProviders(
      <RoutePreviewCard
        form={createEmptyOrderInput()}
        quoteState={{
          canRequestQuote: false,
          canSubmit: false,
          error: null,
          isLoading: false,
          isRefreshing: false,
          quote: null,
          validationMessage: "Vui lòng chọn địa chỉ lấy hàng từ danh sách gợi ý.",
        }}
      />,
    );

    expect(
      screen.getByText(/Bản đồ thật sẽ hiển thị sau khi bạn chốt đủ địa chỉ/i),
    ).toBeInTheDocument();
  });
});
