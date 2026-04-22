import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createEmptyOrderInput } from "@/features/orders/domain/value-objects/order-form";
import { renderWithProviders } from "@/test/render";
import RoutePreviewCard from "./RoutePreviewCard";

describe("RoutePreviewCard", () => {
  it("renders the backend quote values and resolved addresses", () => {
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
        }}
      />,
    );

    expect(screen.getByText("123 Nguyễn Văn Linh, Quận 7")).toBeInTheDocument();
    expect(screen.getByText("456 Điện Biên Phủ, Bình Thạnh")).toBeInTheDocument();
    expect(screen.getByText(/42.500/)).toBeInTheDocument();
    expect(screen.getByText("5.2 km")).toBeInTheDocument();
    expect(screen.getByText("20 mins")).toBeInTheDocument();
  });
});
