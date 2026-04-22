import { screen, waitFor } from "@testing-library/react";
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
      mutateAsync: vi.fn().mockResolvedValue(undefined),
    });
  });

  it("renders the missing-order state when checkout cannot resolve an order", () => {
    useCheckoutMock.mockReturnValue({
      order: null,
      isLoading: false,
      orderId: null,
      loadError: checkoutCopy.emptyOrderDescription,
      paymentRecord: null,
    });

    renderWithProviders(<CheckoutScreen />);

    expect(screen.getByText(checkoutCopy.checkoutErrorTitle)).toBeInTheDocument();
  });

  it("renders the Stripe configuration fallback and removes the customer COD CTA", () => {
    useCheckoutMock.mockReturnValue({
      order: {
        ...sampleOrder,
        payment: null,
        pricing: undefined,
      },
      orderId: sampleOrder.id,
      isLoading: false,
      loadError: null,
      paymentRecord: null,
    });

    renderWithProviders(<CheckoutScreen />);

    expect(screen.getAllByText(checkoutCopy.pendingApiQuote).length).toBeGreaterThan(0);
    expect(
      screen.getByText("Stripe chưa được cấu hình trên frontend. Hãy thiết lập NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: checkoutCopy.confirmCodOrder })).not.toBeInTheDocument();
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
      isLoading: false,
      loadError: null,
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
        payment: null,
        pricing: {
          ...sampleOrder.pricing!,
          currency: "VND",
          total: 26089.8,
        },
      },
      orderId: "22",
      isLoading: false,
      loadError: null,
      paymentRecord: null,
    });

    renderWithProviders(<CheckoutScreen />);

    await waitFor(() => expect(mutateAsync).toHaveBeenCalledTimes(1));
    expect(mutateAsync).toHaveBeenCalledWith("22");
  });

  it("does not create a Stripe intent for orders already marked as COD", async () => {
    const mutateAsync = vi.fn();

    useCreatePaymentIntentMock.mockImplementation(() => ({
      data: null,
      isPending: false,
      mutateAsync,
    }));

    useCheckoutMock.mockReturnValue({
      order: {
        ...sampleOrder,
        payment: {
          amount: 42500,
          method: "COD",
          orderId: sampleOrder.id,
          paidAt: null,
          status: "PENDING",
          transactionId: null,
        },
      },
      orderId: sampleOrder.id,
      isLoading: false,
      loadError: null,
      paymentRecord: null,
    });

    renderWithProviders(<CheckoutScreen />);

    await waitFor(() =>
      expect(
        screen.getByText(/customer checkout không hỗ trợ chuyển đổi sang thanh toán online/i),
      ).toBeInTheDocument(),
    );
    expect(mutateAsync).not.toHaveBeenCalled();
  });
});
