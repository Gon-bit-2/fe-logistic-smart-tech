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

vi.mock("@/features/orders/presentation/hooks/useCreateOrder", () => ({
  useCreateOrder: () => useCreateOrderState,
}));

describe("OrderForm", () => {
  beforeEach(() => {
    useCreateOrderState.error = null;
    useCreateOrderState.isPending = false;
    useCreateOrderState.mutateAsync.mockReset();
  });

  it("updates the draft and submits it through the order creation hook", async () => {
    const onSubmitSuccess = vi.fn();
    useCreateOrderState.mutateAsync.mockResolvedValue(sampleOrder);

    renderWithProviders(<OrderForm onSubmitSuccess={onSubmitSuccess} />);

    fireEvent.change(screen.getByLabelText(orderFormCopy.customer), {
      target: { value: "Công ty Emerald" },
    });
    fireEvent.change(screen.getByLabelText(orderFormCopy.pickupAddress), {
      target: { value: "123 Nguyễn Văn Linh" },
    });
    fireEvent.change(screen.getByLabelText(orderFormCopy.deliveryAddress), {
      target: { value: "456 Điện Biên Phủ" },
    });
    fireEvent.change(screen.getByLabelText(orderFormCopy.weight), {
      target: { value: "25" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Chuyến ghép xanh/i }));
    fireEvent.submit(
      screen.getByRole("button", { name: /Tạo đơn hàng/i }).closest("form")!,
    );

    await waitFor(() => {
      expect(useCreateOrderState.mutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          customerName: "Công ty Emerald",
          pickupAddress: "123 Nguyễn Văn Linh",
          deliveryAddress: "456 Điện Biên Phủ",
          packageWeightKg: 25,
          serviceTier: "eco_green",
        }),
      );
      expect(onSubmitSuccess).toHaveBeenCalledWith(sampleOrder);
    });
  });
});
