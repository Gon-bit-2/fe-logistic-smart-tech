import { fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { sampleOrder } from "../../../../../tests/fixtures/api";
import { orderFormCopy } from "@/i18n/vi";
import { renderWithProviders } from "@/test/render";
import OrderForm from "./OrderForm";

const useCreateOrderState = {
  error: null as string | null,
  isPending: false,
  mutateAsync: vi.fn(),
  order: null,
};

const getPlaceAutocomplete = vi.fn();
const getPlaceDetail = vi.fn();

vi.mock("@/features/orders/presentation/hooks/useCreateOrder", () => ({
  useCreateOrder: () => useCreateOrderState,
}));

vi.mock("@/features/maps/infrastructure/api/maps.api", () => ({
  getPlaceAutocomplete: (...args: unknown[]) => getPlaceAutocomplete(...args),
  getPlaceDetail: (...args: unknown[]) => getPlaceDetail(...args),
}));

const quoteState = {
  canRequestQuote: true,
  canSubmit: true,
  error: null,
  isLoading: false,
  isRefreshing: false,
  quote: null,
} as const;

describe("OrderForm", () => {
  beforeEach(() => {
    useCreateOrderState.error = null;
    useCreateOrderState.isPending = false;
    useCreateOrderState.mutateAsync.mockReset();
    getPlaceAutocomplete.mockReset();
    getPlaceDetail.mockReset();
    getPlaceAutocomplete.mockImplementation(async (input: string) => ({
      predictions: [
        {
          description:
            input.includes("123")
              ? "123 Nguyễn Văn Linh, Quận 7"
              : "456 Điện Biên Phủ, Bình Thạnh",
          place_id: input.includes("123") ? "pickup-place" : "delivery-place",
          structured_formatting: {
            main_text: input.includes("123") ? "123 Nguyễn Văn Linh" : "456 Điện Biên Phủ",
            secondary_text: input.includes("123") ? "Quận 7, TP HCM" : "Bình Thạnh, TP HCM",
          },
        },
      ],
    }));
    getPlaceDetail.mockImplementation(async (placeId: string) => ({
      result: {
        formatted_address:
          placeId === "pickup-place"
            ? "123 Nguyễn Văn Linh, Quận 7"
            : "456 Điện Biên Phủ, Bình Thạnh",
        geometry: {
          location: {
            lat: placeId === "pickup-place" ? 10.728851 : 10.80035,
            lng: placeId === "pickup-place" ? 106.721659 : 106.71482,
          },
        },
        place_id: placeId,
      },
    }));
  });

  it("requires resolved addresses from autocomplete before submitting", async () => {
    const onSubmitSuccess = vi.fn();
    useCreateOrderState.mutateAsync.mockResolvedValue(sampleOrder);

    renderWithProviders(
      <OrderForm onSubmitSuccess={onSubmitSuccess} quoteState={quoteState} />,
    );

    const pickupInput = screen.getByLabelText(orderFormCopy.pickupAddress);
    fireEvent.focus(pickupInput);
    fireEvent.change(pickupInput, {
      target: { value: "123 Nguyễn Văn Linh" },
    });
    await screen.findByRole("button", { name: /123 Nguyễn Văn Linh/i });
    fireEvent.click(screen.getByRole("button", { name: /123 Nguyễn Văn Linh/i }));

    const deliveryInput = screen.getByLabelText(orderFormCopy.deliveryAddress);
    fireEvent.focus(deliveryInput);
    fireEvent.change(deliveryInput, {
      target: { value: "456 Điện Biên Phủ" },
    });
    await screen.findByRole("button", { name: /456 Điện Biên Phủ/i });
    fireEvent.click(screen.getByRole("button", { name: /456 Điện Biên Phủ/i }));
    await waitFor(() => {
      expect(screen.getAllByText(orderFormCopy.addressSelected)).toHaveLength(2);
    });

    fireEvent.change(screen.getByLabelText(orderFormCopy.contactName), {
      target: { value: "Lan" },
    });
    fireEvent.change(screen.getByLabelText(orderFormCopy.contactPhone), {
      target: { value: "0909000001" },
    });
    fireEvent.change(screen.getByLabelText(orderFormCopy.receiverName), {
      target: { value: "Minh" },
    });
    fireEvent.change(screen.getByLabelText(orderFormCopy.receiverPhone), {
      target: { value: "0909000002" },
    });
    fireEvent.change(screen.getByLabelText(orderFormCopy.weight), {
      target: { value: "25" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Chuyến ghép xanh/i }));
    const submitButton = screen.getByRole("button", { name: /Tạo đơn hàng/i });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
    fireEvent.submit(submitButton.closest("form")!);

    await waitFor(() => {
      expect(useCreateOrderState.mutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          contactName: "Lan",
          contactPhone: "0909000001",
          delivery: expect.objectContaining({
            address: "456 Điện Biên Phủ, Bình Thạnh",
            isResolved: true,
            latitude: 10.80035,
            longitude: 106.71482,
            placeId: "delivery-place",
          }),
          packageWeightKg: 25,
          paymentMethod: "STRIPE",
          pickup: expect.objectContaining({
            address: "123 Nguyễn Văn Linh, Quận 7",
            isResolved: true,
            latitude: 10.728851,
            longitude: 106.721659,
            placeId: "pickup-place",
          }),
          receiverName: "Minh",
          receiverPhone: "0909000002",
          serviceTier: "eco_green",
        }),
      );
      expect(onSubmitSuccess).toHaveBeenCalledWith(sampleOrder);
    });
  });
});
