"use client";

import { Link } from "@/i18n/routing";
import { useEffect, useMemo, useRef, useState } from "react";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "@/i18n/routing";
import OperationsTopBar from "@/components/layout/OperationsTopBar";
import AppIcon from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import type { OrderPricing } from "@/features/orders/domain/types/order.types";
import { useCheckout } from "@/features/orders/presentation/hooks/useCheckout";
import { getPaymentStatusLabel } from "@/features/payments/presentation/utils/payment-labels";
import { useCreatePaymentIntent } from "@/features/payments/presentation/hooks/usePaymentIntent";
import { useI18nCopy } from "@/i18n/useCopy";
import { normalizePublicEnvValue } from "@/lib/api/env";
import { formatCurrency } from "@/utils/formatters";

function formatPricingValue(
  value?: number,
  currency?: OrderPricing["currency"],
  pendingLabel = "Pending quote",
) {
  return typeof value === "number"
    ? formatCurrency(value, currency ?? "USD")
    : pendingLabel;
}

const stripePublishableKey = normalizePublicEnvValue(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

const stripePromise = stripePublishableKey
  ? process.env.NODE_ENV === "test"
    ? null
    : loadStripe(stripePublishableKey)
  : null;

type StripePaymentFormProps = {
  onError: (message: string | null) => void;
  onSuccess: () => void;
  payLabel: string;
  processingLabel: string;
};

type CheckoutScreenProps = Readonly<{
  orderId?: string | null;
  reference?: string | null;
  showTopBar?: boolean;
}>;

function StripePaymentForm({
  onError,
  onSuccess,
  payLabel,
  processingLabel,
}: Readonly<StripePaymentFormProps>) {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (!stripe || !elements) {
      return;
    }

    setIsSubmitting(true);
    onError(null);

    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (result.error) {
      onError(result.error.message ?? null);
      setIsSubmitting(false);
      return;
    }

    onSuccess();
    setIsSubmitting(false);
  }

  return (
    <div className="space-y-4">
      <PaymentElement />
      <Button
        onClick={handleSubmit}
        className="h-14 w-full bg-gradient-to-br from-tertiary to-tertiary-container text-base font-black text-white"
      >
        {isSubmitting ? processingLabel : payLabel}
      </Button>
    </div>
  );
}

export default function CheckoutScreen({
  orderId = null,
  reference = null,
  showTopBar = true,
}: CheckoutScreenProps) {
  const { checkoutCopy } = useI18nCopy();
  const router = useRouter();
  const {
    order,
    orderId: resolvedOrderId,
    isLoading,
    loadError,
    paymentRecord,
  } = useCheckout({
    orderId,
    reference,
  });
  const createPaymentIntent = useCreatePaymentIntent();
  const [error, setError] = useState<string | null>(null);
  const autoIntentAttemptRef = useRef<string | null>(null);
  const clientSecret = createPaymentIntent.data?.clientSecret ?? null;
  const pricing = order?.pricing;
  const normalizedGatewayAmount = createPaymentIntent.data?.amount;
  const trackingDestination = order?.trackingCode ?? order?.reference ?? "";
  const effectivePaymentRecord = paymentRecord ?? order?.payment ?? null;
  const paymentMethod = effectivePaymentRecord?.method ?? "STRIPE";
  const isPaymentCompleted = effectivePaymentRecord?.status === "COMPLETED";
  const isCodPayment = paymentMethod === "COD";
  const paymentAttemptKey = [
    resolvedOrderId ?? "missing-order",
    pricing?.currency ?? "missing-currency",
    pricing?.total ?? "missing-total",
    effectivePaymentRecord?.status ?? "missing-status",
  ].join(":");

  useEffect(() => {
    if (!order || !resolvedOrderId || isPaymentCompleted || isCodPayment) {
      autoIntentAttemptRef.current = null;
      return;
    }

    if (clientSecret || createPaymentIntent.isPending) {
      return;
    }

    if (autoIntentAttemptRef.current === paymentAttemptKey) {
      return;
    }

    autoIntentAttemptRef.current = paymentAttemptKey;
    queueMicrotask(() => {
      setError(null);
    });

    void createPaymentIntent.mutateAsync(resolvedOrderId).catch((caughtError) => {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Không thể chuẩn bị cổng thanh toán trực tuyến.",
      );
    });
  }, [
    clientSecret,
    createPaymentIntent,
    isCodPayment,
    isPaymentCompleted,
    order,
    resolvedOrderId,
    paymentAttemptKey,
    pricing,
  ]);

  useEffect(() => {
    if (
      resolvedOrderId &&
      clientSecret &&
      autoIntentAttemptRef.current !== paymentAttemptKey
    ) {
      autoIntentAttemptRef.current = paymentAttemptKey;
    }
  }, [clientSecret, paymentAttemptKey, resolvedOrderId]);

  const stripeOptions = useMemo(
    () =>
      clientSecret
        ? {
            clientSecret,
            appearance: {
              theme: "stripe" as const,
            },
          }
        : null,
    [clientSecret],
  );
  const totalAmount = normalizedGatewayAmount ?? pricing?.total;
  const totalCurrency = pricing?.currency ?? (normalizedGatewayAmount != null ? "VND" : undefined);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface">
        {showTopBar ? <OperationsTopBar active="shipments" /> : null}
        <main className="mx-auto max-w-5xl px-6 py-12 md:px-8">
          <div className="rounded-xl bg-surface-container-lowest p-8 text-on-surface shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)]">
            {checkoutCopy.loadOrder}
          </div>
        </main>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-surface">
        {showTopBar ? <OperationsTopBar active="shipments" /> : null}
        <main className="mx-auto max-w-5xl px-6 py-12 md:px-8">
          <div className="rounded-xl bg-surface-container-lowest p-8 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)]">
            <p className="text-[10px] font-black tracking-[0.16em] text-primary uppercase">
              {checkoutCopy.checkoutErrorEyebrow}
            </p>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-on-surface">
              {checkoutCopy.checkoutErrorTitle}
            </h1>
            <p className="mt-3 text-sm leading-6 text-on-surface-variant">
              {loadError ?? checkoutCopy.emptyOrderDescription}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {showTopBar ? <OperationsTopBar active="shipments" /> : null}
      <main className="mx-auto max-w-7xl px-6 py-10 md:px-8">
        <div className="mb-12">
          <h1 className="text-[2.75rem] font-black tracking-tight text-on-surface">
            {checkoutCopy.title}
          </h1>
          <p className="mt-2 font-medium text-slate-500">
            {checkoutCopy.orderSubtitle(order.reference)}
          </p>
        </div>

        <div className="grid items-start gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-8">
            <section className="rounded-xl bg-surface-container-lowest p-8 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.06)]">
              <div className="mb-8 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <h2 className="text-xl font-black tracking-tight text-on-surface">
                  {checkoutCopy.paymentDetails}
                </h2>
              </div>

              <div className="space-y-6">
                {isPaymentCompleted ? (
                  <div className="rounded-xl bg-primary/8 p-4 text-sm text-on-surface">
                    Đơn hàng này đã được thanh toán. Bạn có thể quay lại trang theo dõi để xem trạng thái giao nhận.
                  </div>
                ) : isCodPayment ? (
                  <div className="space-y-4 rounded-xl bg-surface-container-low p-4 text-sm text-on-surface/70">
                    <p>{checkoutCopy.redirectToCodTracking}</p>
                    <Link
                      href={`/tracking/${trackingDestination}`}
                      className="inline-flex h-11 items-center rounded-xl bg-primary px-4 text-sm font-bold text-white"
                    >
                      {checkoutCopy.codTrackingCta}
                    </Link>
                  </div>
                ) : stripePromise && stripeOptions ? (
                  <Elements stripe={stripePromise} options={stripeOptions}>
                    <StripePaymentForm
                      onError={setError}
                      onSuccess={() => router.push(`/tracking/${trackingDestination}`)}
                      payLabel={checkoutCopy.payAndConfirmOrder}
                      processingLabel={checkoutCopy.processing}
                    />
                  </Elements>
                ) : (
                  <div className="rounded-xl bg-surface-container-low p-4 text-sm text-on-surface/70">
                    {!stripePublishableKey
                      ? "Stripe chưa được cấu hình trên frontend. Hãy thiết lập NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY."
                      : createPaymentIntent.isPending
                      ? "Đang chuẩn bị cổng thanh toán..."
                      : !resolvedOrderId
                      ? "Không tìm thấy orderId hợp lệ để khởi tạo thanh toán."
                      : "Thanh toán trực tuyến hiện chưa sẵn sàng. Vui lòng thử lại sau."}
                  </div>
                )}

                <div className="rounded-xl border border-outline-variant/10 bg-surface-container-low p-4">
                  <p className="font-semibold text-on-surface">
                    {checkoutCopy.cardPayment}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {checkoutCopy.cardPaymentDescription}
                  </p>
                </div>
              </div>
            </section>

            <div className="flex items-center gap-6 rounded-xl bg-surface-container-low p-6">
              <AppIcon name="verified_user" className="text-3xl text-tertiary" />
              <div>
                <p className="font-bold text-on-surface-variant">
                  {checkoutCopy.insuranceTitle}
                </p>
                <p className="text-sm text-slate-500">
                  {checkoutCopy.insuranceDescription}
                </p>
              </div>
            </div>
          </div>

          <aside className="space-y-8 lg:sticky lg:top-24">
            <div className="rounded-xl bg-surface-container-lowest p-8 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)]">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-xl font-black tracking-tight text-on-surface">
                  {checkoutCopy.orderSummary}
                </h2>
                <AppIcon name="receipt_long" className="text-slate-300" />
              </div>

              <div className="space-y-4 text-on-surface-variant">
                <div className="flex justify-between">
                  <span>{checkoutCopy.logisticsFee}</span>
                  <span className="font-medium">
                    {formatPricingValue(
                      pricing?.logisticsFee,
                      pricing?.currency,
                      checkoutCopy.pendingApiQuote,
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{checkoutCopy.shippingAndHandling}</span>
                  <span className="font-medium">
                    {formatPricingValue(
                      pricing?.handlingFee,
                      pricing?.currency,
                      checkoutCopy.pendingApiQuote,
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-primary/10 px-3 py-2">
                  <span className="text-sm font-semibold text-primary">
                    {checkoutCopy.ecoDiscount}
                  </span>
                  <span className="font-black text-primary">
                    {typeof pricing?.ecoDiscount === "number"
                      ? `-${formatCurrency(pricing.ecoDiscount, pricing.currency)}`
                      : checkoutCopy.pendingApiQuote}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{checkoutCopy.vat}</span>
                  <span className="font-medium">
                    {formatPricingValue(
                      pricing?.vat,
                      pricing?.currency,
                      checkoutCopy.pendingApiQuote,
                    )}
                  </span>
                </div>
              </div>

              <div className="my-8 border-t border-dashed border-outline-variant/30 pt-6">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-black tracking-[0.16em] text-slate-400 uppercase">
                      {checkoutCopy.totalAmount}
                    </p>
                    <p className="mt-1 text-3xl font-black tracking-tight text-on-surface">
                      {formatPricingValue(
                        totalAmount,
                        totalCurrency,
                        checkoutCopy.pendingApiQuote,
                      )}
                    </p>
                  </div>
                  <span className="rounded-full bg-secondary-container px-3 py-1 text-[10px] font-black tracking-[0.12em] text-on-secondary-container uppercase">
                    {totalCurrency ?? checkoutCopy.awaitingQuote}
                  </span>
                </div>
                {!pricing ? (
                  <p className="mt-4 text-xs leading-5 text-on-surface-variant">
                    {checkoutCopy.pricingDescription}
                  </p>
                ) : null}
              </div>

              {error ? (
                <p className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </p>
              ) : null}
              {effectivePaymentRecord ? (
                <p className="mt-4 rounded-xl bg-primary/8 px-4 py-3 text-sm text-on-surface">
                  Trạng thái thanh toán: <strong>{getPaymentStatusLabel(effectivePaymentRecord.status)}</strong>
                </p>
              ) : null}
            </div>

            <div className="relative rounded-xl bg-surface-container-high p-6">
              <div className="absolute -right-4 -top-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <AppIcon name="eco" className="text-primary" />
              </div>
              <h3 className="mb-2 text-sm font-black text-primary">
                {checkoutCopy.sustainableChoice}
              </h3>
              <p className="text-xs leading-6 text-on-surface-variant">
                {typeof order.co2SavedKg === "number"
                  ? checkoutCopy.sustainabilityValue(order.co2SavedKg)
                  : checkoutCopy.sustainabilityMissing}
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
