import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { sampleOrder } from "../../../../../tests/fixtures/api";
import { checkoutCopy } from "@/i18n/vi";
import { renderWithProviders } from "@/test/render";
import CheckoutScreen from "./CheckoutScreen";

const useCheckoutMock = vi.fn();

vi.mock("@/features/orders/presentation/hooks/useCheckout", () => ({
  useCheckout: () => useCheckoutMock(),
}));

describe("CheckoutScreen", () => {
  beforeEach(() => {
    useCheckoutMock.mockReset();
  });

  it("renders the missing-order state when checkout cannot resolve an order", () => {
    useCheckoutMock.mockReturnValue({
      order: null,
      paymentMethod: "card",
      setPaymentMethod: vi.fn(),
      cardState: {
        cardNumber: "",
        expiryDate: "",
        cvc: "",
      },
      updateCardState: vi.fn(),
      confirmCheckout: vi.fn(),
      isLoading: false,
      isSubmitting: false,
      loadError: checkoutCopy.emptyOrderDescription,
      error: null,
    });

    renderWithProviders(<CheckoutScreen />);

    expect(screen.getByText(checkoutCopy.checkoutErrorTitle)).toBeInTheDocument();
  });

  it("renders pricing fallback text and allows COD confirmation", () => {
    const confirmCheckout = vi.fn();
    const setPaymentMethod = vi.fn();

    useCheckoutMock.mockReturnValue({
      order: {
        ...sampleOrder,
        pricing: undefined,
      },
      paymentMethod: "cash_on_delivery",
      setPaymentMethod,
      cardState: {
        cardNumber: "",
        expiryDate: "",
        cvc: "",
      },
      updateCardState: vi.fn(),
      confirmCheckout,
      isLoading: false,
      isSubmitting: false,
      loadError: null,
      error: null,
    });

    renderWithProviders(<CheckoutScreen />);

    expect(screen.getAllByText(checkoutCopy.pendingApiQuote).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: checkoutCopy.confirmCodOrder }));
    expect(confirmCheckout).toHaveBeenCalledTimes(1);
    expect(setPaymentMethod).not.toHaveBeenCalled();
  });
});
