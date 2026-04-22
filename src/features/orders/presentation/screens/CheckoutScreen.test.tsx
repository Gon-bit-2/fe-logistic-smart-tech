import { fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { sampleOrder } from "../../../../../tests/fixtures/api";
import { checkoutCopy } from "@/i18n/vi";
import { renderWithProviders } from "@/test/render";
import CheckoutScreen from "./CheckoutScreen";

const useCheckoutMock = vi.fn();
const useCreatePaymentIntentMock = vi.fn();

vi.mock("@/features/orders/presentation/hooks/useCheckout", () => ({
  useCheckout: () => useCheckoutMock(),
}));

vi.mock("@/features/payments/presentation/hooks/usePaymentIntent", () => ({
  useCreatePaymentIntent: () => useCreatePaymentIntentMock(),
}));

vi.mock("@stripe/stripe-js", () => ({
  loadStripe: vi.fn(() => null),
}));

vi.mock("@stripe/react-stripe-js", () => ({
  Elements: ({ children }: { children: unknown }) => <>{children}</>,
  PaymentElement: () => <div data-testid="payment-element" />,
  useElements: () => null,
  useStripe: () => null,
}));

describe("CheckoutScreen", () => {
  beforeEach(() => {
    useCheckoutMock.mockReset();
    useCreatePaymentIntentMock.mockReset();
    useCreatePaymentIntentMock.mockReturnValue({
      data: null,
      isPending: false,
      mutateAsync: vi.fn(),
    });
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
      paymentRecord: null,
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
      paymentRecord: null,
    });

    renderWithProviders(<CheckoutScreen />);

    expect(screen.getAllByText(checkoutCopy.pendingApiQuote).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: checkoutCopy.confirmCodOrder }));
    expect(confirmCheckout).toHaveBeenCalledTimes(1);
    expect(setPaymentMethod).not.toHaveBeenCalled();
  });

  it("does not retry create payment intent in a render loop after a failure", async () => {
    const mutateAsync = vi.fn().mockRejectedValue(new Error("ThrottlerException: Too Many Requests"));

    useCreatePaymentIntentMock.mockImplementation(() => ({
      data: null,
      isPending: false,
      mutateAsync,
    }));

    useCheckoutMock.mockReturnValue({
      order: sampleOrder,
      orderId: "21",
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
      loadError: null,
      error: null,
      paymentRecord: null,
    });

    renderWithProviders(<CheckoutScreen />);

    await waitFor(() =>
      expect(screen.getByText("ThrottlerException: Too Many Requests")).toBeInTheDocument(),
    );

    expect(mutateAsync).toHaveBeenCalledTimes(1);
    expect(mutateAsync).toHaveBeenCalledWith("21");
  });

  it("still creates a payment intent when the VND total has decimals", async () => {
    const mutateAsync = vi.fn().mockResolvedValue({
      amount: 26090,
      clientSecret: "pi_secret",
      transactionId: "pi_123",
    });

    useCreatePaymentIntentMock.mockImplementation(() => ({
      data: null,
      isPending: false,
      mutateAsync,
    }));

    useCheckoutMock.mockReturnValue({
      order: {
        ...sampleOrder,
        pricing: {
          ...sampleOrder.pricing!,
          currency: "VND",
          total: 26089.8,
        },
      },
      orderId: "22",
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
      loadError: null,
      error: null,
      paymentRecord: null,
    });

    renderWithProviders(<CheckoutScreen />);

    await waitFor(() => expect(mutateAsync).toHaveBeenCalledTimes(1));
    expect(mutateAsync).toHaveBeenCalledWith("22");
  });
});
