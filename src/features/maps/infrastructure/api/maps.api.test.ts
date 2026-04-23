import { beforeEach, describe, expect, it, vi } from "vitest";

const get = vi.fn();

vi.mock("@/lib/api/http-client", () => ({
  httpClient: {
    get,
  },
}));

describe("maps.api", () => {
  beforeEach(() => {
    get.mockReset();
  });

  it("normalizes the backend autocomplete payload into Goong-like predictions", async () => {
    get.mockResolvedValueOnce({
      data: {
        data: [
          {
            description: "123 Nguyen Van Linh, Quan 7, TP HCM",
            mainText: "123 Nguyen Van Linh",
            placeId: "pickup-place",
            secondaryText: "Quan 7, TP HCM",
          },
        ],
      },
    });

    const { getPlaceAutocomplete } = await import("./maps.api");

    await expect(getPlaceAutocomplete("123 Nguyen Van Linh")).resolves.toEqual({
      predictions: [
        {
          description: "123 Nguyen Van Linh, Quan 7, TP HCM",
          place_id: "pickup-place",
          structured_formatting: {
            main_text: "123 Nguyen Van Linh",
            secondary_text: "Quan 7, TP HCM",
          },
        },
      ],
    });
    expect(get).toHaveBeenCalledWith("/maps/places/autocomplete", {
      params: {
        input: "123 Nguyen Van Linh",
      },
    });
  });

  it("uses the backend placeId query param and normalizes the place detail payload", async () => {
    get.mockResolvedValueOnce({
      data: {
        formattedAddress: "456 Dien Bien Phu, Binh Thanh, TP HCM",
        latitude: 10.80035,
        longitude: 106.71482,
        name: "456 Dien Bien Phu",
        placeId: "delivery-place",
      },
    });

    const { getPlaceDetail } = await import("./maps.api");

    await expect(getPlaceDetail("delivery-place")).resolves.toEqual({
      result: {
        formatted_address: "456 Dien Bien Phu, Binh Thanh, TP HCM",
        geometry: {
          location: {
            lat: 10.80035,
            lng: 106.71482,
          },
        },
        name: "456 Dien Bien Phu",
        place_id: "delivery-place",
      },
    });
    expect(get).toHaveBeenCalledWith("/maps/places/detail", {
      params: {
        placeId: "delivery-place",
      },
    });
  });
});
