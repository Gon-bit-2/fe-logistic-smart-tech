"use client";

import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createEmptyOrderInput } from "@/features/orders/domain/value-objects/order-form";
import type {
  CreateOrderInput,
  OrderDTO,
  ResolvedOrderAddressInput,
  ServiceTier,
} from "@/features/orders/domain/types/order.types";
import ServiceTierSelector from "@/features/orders/presentation/components/ServiceTierSelector";
import { useResolvedAddressField } from "@/features/orders/presentation/hooks/useResolvedAddressField";
import type { OrderQuoteState } from "@/features/orders/presentation/hooks/useOrderQuote";
import { useCreateOrder } from "@/features/orders/presentation/hooks/useCreateOrder";
import { orderFormCopy } from "@/i18n/vi";
import { formatCurrency } from "@/utils/formatters";

type OrderFormProps = Readonly<{
  ctaLabel?: string;
  onChange?: (nextValue: CreateOrderInput) => void;
  onSubmitSuccess?: (order: OrderDTO) => void;
  quoteState: OrderQuoteState;
  value?: CreateOrderInput;
}>;

type AddressAutocompleteFieldProps = {
  label: string;
  onChange: (nextValue: ResolvedOrderAddressInput) => void;
  value: ResolvedOrderAddressInput;
};

function toDateTimeLocalValue(isoString: string) {
  if (!isoString) {
    return "";
  }

  return new Date(isoString).toISOString().slice(0, 16);
}

function toIsoString(value: string) {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString();
}

function AddressAutocompleteField({
  label,
  onChange,
  value,
}: Readonly<AddressAutocompleteFieldProps>) {
  const [isFocused, setIsFocused] = useState(false);
  const controller = useResolvedAddressField(value, onChange);
  const showSuggestions =
    isFocused &&
    !controller.isResolved &&
    controller.query.trim().length >= 2 &&
    (controller.isLoadingPredictions || controller.predictions.length > 0);

  return (
    <label className="space-y-2">
      <span className="px-1 text-[10px] font-black tracking-[0.16em] text-outline uppercase">
        {label}
      </span>
      <div className="relative">
        <Input
          aria-label={label}
          value={controller.query}
          onBlur={() => {
            window.setTimeout(() => {
              setIsFocused(false);
            }, 120);
          }}
          onChange={(event) => controller.setQuery(event.target.value)}
          onFocus={() => setIsFocused(true)}
          className="border-b border-outline-variant/25 pb-3 focus:rounded-lg"
          placeholder={orderFormCopy.addressAutocompleteHint}
        />

        {showSuggestions ? (
          <div className="absolute top-[calc(100%+0.5rem)] z-20 w-full overflow-hidden rounded-2xl border border-outline-variant/20 bg-white shadow-[0_24px_50px_-20px_rgba(6,78,59,0.3)]">
            {controller.isLoadingPredictions ? (
              <p className="px-4 py-3 text-sm text-slate-500">
                {orderFormCopy.addressAutocompleteLoading}
              </p>
            ) : (
              <ul className="max-h-64 overflow-y-auto py-2">
                {controller.predictions.map((prediction) => (
                  <li key={prediction.place_id ?? prediction.description}>
                    <button
                      type="button"
                      className="flex w-full flex-col gap-1 px-4 py-3 text-left transition hover:bg-slate-50"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => {
                        setIsFocused(false);
                        void controller.selectPrediction(prediction);
                      }}
                    >
                      <span className="text-sm font-semibold text-slate-900">
                        {prediction.structured_formatting?.main_text ??
                          prediction.description ??
                          "Địa chỉ gợi ý"}
                      </span>
                      <span className="text-xs text-slate-500">
                        {prediction.structured_formatting?.secondary_text ??
                          prediction.description}
                      </span>
                    </button>
                  </li>
                ))}
                {controller.predictions.length === 0 ? (
                  <li className="px-4 py-3 text-sm text-slate-500">
                    {orderFormCopy.addressAutocompleteEmpty}
                  </li>
                ) : null}
              </ul>
            )}
          </div>
        ) : null}
      </div>

      <div className="min-h-5">
        {controller.isResolvingSelection ? (
          <p className="text-xs text-primary">{orderFormCopy.resolvingAddress}</p>
        ) : controller.isResolved ? (
          <p className="text-xs font-semibold text-primary">
            {orderFormCopy.addressSelected}
          </p>
        ) : controller.error ? (
          <p className="text-xs text-destructive">{controller.error}</p>
        ) : (
          <p className="text-xs text-on-surface-variant">
            {orderFormCopy.addressAutocompleteRequired}
          </p>
        )}
      </div>
    </label>
  );
}

export default function OrderForm({
  ctaLabel = "Tạo đơn hàng",
  onChange,
  onSubmitSuccess,
  quoteState,
  value,
}: OrderFormProps) {
  const { mutateAsync, isPending, order, error } = useCreateOrder();
  const [internalForm, setInternalForm] = useState(createEmptyOrderInput);
  const form = value ?? internalForm;
  const formRef = useRef(form);

  useEffect(() => {
    formRef.current = form;
  }, [form]);

  function updateForm(nextValue: CreateOrderInput) {
    formRef.current = nextValue;
    setInternalForm(nextValue);
    onChange?.(nextValue);
  }

  function updateField<Key extends keyof CreateOrderInput>(
    key: Key,
    nextValue: CreateOrderInput[Key],
  ) {
    updateForm({
      ...formRef.current,
      [key]: nextValue,
    });
  }

  function updateAddressField(
    key: "pickup" | "delivery",
    nextValue: ResolvedOrderAddressInput,
  ) {
    updateField(key, nextValue);
  }

  const isFormComplete = useMemo(
    () =>
      Boolean(
        form.contactName.trim() &&
          form.contactPhone.trim() &&
          form.receiverName.trim() &&
          form.receiverPhone.trim() &&
          form.pickup.isResolved &&
          form.delivery.isResolved &&
          Number(form.packageWeightKg) > 0,
      ),
    [
      form.contactName,
      form.contactPhone,
      form.delivery.isResolved,
      form.packageWeightKg,
      form.pickup.isResolved,
      form.receiverName,
      form.receiverPhone,
    ],
  );

  const canSubmit = isFormComplete && quoteState.canSubmit && !isPending;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    const nextOrder = await mutateAsync(form);
    onSubmitSuccess?.(nextOrder);
  }

  return (
    <section className="rounded-xl bg-surface-container-lowest p-8 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)]">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black tracking-[0.16em] text-primary uppercase">
            {orderFormCopy.ordersEyebrow}
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-on-surface">
            {orderFormCopy.createTitle}
          </h3>
          <p className="mt-1 text-sm text-outline">{orderFormCopy.subtitle}</p>
        </div>
        <div className="hidden items-center gap-4 md:flex">
          {orderFormCopy.stepLabels.map((label, index) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black ${
                  index === 0
                    ? "bg-primary text-white"
                    : "bg-surface-container-high text-on-surface-variant"
                }`}
              >
                {index + 1}
              </div>
              <span className="text-[10px] font-black tracking-[0.14em] text-outline uppercase">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <AddressAutocompleteField
            label={orderFormCopy.pickupAddress}
            value={form.pickup}
            onChange={(nextValue) => updateAddressField("pickup", nextValue)}
          />

          <AddressAutocompleteField
            label={orderFormCopy.deliveryAddress}
            value={form.delivery}
            onChange={(nextValue) => updateAddressField("delivery", nextValue)}
          />

          <label className="space-y-2">
            <span className="px-1 text-[10px] font-black tracking-[0.16em] text-outline uppercase">
              {orderFormCopy.contactName}
            </span>
            <Input
              value={form.contactName}
              onChange={(event) => updateField("contactName", event.target.value)}
              className="border-b border-outline-variant/25 pb-3 focus:rounded-lg"
              required
            />
          </label>

          <label className="space-y-2">
            <span className="px-1 text-[10px] font-black tracking-[0.16em] text-outline uppercase">
              {orderFormCopy.contactPhone}
            </span>
            <Input
              value={form.contactPhone}
              onChange={(event) => updateField("contactPhone", event.target.value)}
              className="border-b border-outline-variant/25 pb-3 focus:rounded-lg"
              required
            />
          </label>

          <label className="space-y-2">
            <span className="px-1 text-[10px] font-black tracking-[0.16em] text-outline uppercase">
              {orderFormCopy.receiverName}
            </span>
            <Input
              value={form.receiverName}
              onChange={(event) => updateField("receiverName", event.target.value)}
              className="border-b border-outline-variant/25 pb-3 focus:rounded-lg"
              required
            />
          </label>

          <label className="space-y-2">
            <span className="px-1 text-[10px] font-black tracking-[0.16em] text-outline uppercase">
              {orderFormCopy.receiverPhone}
            </span>
            <Input
              value={form.receiverPhone}
              onChange={(event) => updateField("receiverPhone", event.target.value)}
              className="border-b border-outline-variant/25 pb-3 focus:rounded-lg"
              required
            />
          </label>

          <label className="space-y-2">
            <span className="px-1 text-[10px] font-black tracking-[0.16em] text-outline uppercase">
              {orderFormCopy.estimatedArrival}
            </span>
            <Input
              type="datetime-local"
              value={toDateTimeLocalValue(form.estimatedArrival)}
              onChange={(event) =>
                updateField("estimatedArrival", toIsoString(event.target.value))
              }
              className="border-b border-outline-variant/25 pb-3 focus:rounded-lg"
            />
          </label>

          <label className="space-y-2">
            <span className="px-1 text-[10px] font-black tracking-[0.16em] text-outline uppercase">
              {orderFormCopy.weight}
            </span>
            <Input
              type="number"
              min="0"
              step="0.1"
              value={form.packageWeightKg}
              onChange={(event) =>
                updateField("packageWeightKg", Number(event.target.value || 0))
              }
              className="border-b border-outline-variant/25 pb-3 focus:rounded-lg"
              required
            />
          </label>

          <label className="space-y-2">
            <span className="px-1 text-[10px] font-black tracking-[0.16em] text-outline uppercase">
              {orderFormCopy.dimensions}
            </span>
            <Input
              value={form.packageDimensions}
              onChange={(event) => updateField("packageDimensions", event.target.value)}
              className="border-b border-outline-variant/25 pb-3 focus:rounded-lg"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="px-1 text-[10px] font-black tracking-[0.16em] text-outline uppercase">
              {orderFormCopy.itemDescription}
            </span>
            <textarea
              value={form.itemDescription}
              onChange={(event) => updateField("itemDescription", event.target.value)}
              className="min-h-24 w-full rounded-xl border border-outline-variant/15 bg-surface px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/8"
            />
          </label>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-black tracking-[0.16em] text-outline uppercase">
            {orderFormCopy.selectServiceTier}
          </p>
          <ServiceTierSelector
            value={form.serviceTier}
            onChange={(nextValue: ServiceTier) => updateField("serviceTier", nextValue)}
          />
        </div>

        <div className="rounded-xl bg-surface-container-low px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-on-surface">
                {orderFormCopy.pricingSourceLabel}
              </p>
              <p className="text-xs text-on-surface-variant">
                {orderFormCopy.pricingSourceDescription}
              </p>
            </div>
            <div className="text-right text-[10px] font-black tracking-[0.14em] text-primary uppercase">
              {quoteState.isLoading
                ? orderFormCopy.localMockQuote
                : quoteState.quote
                  ? formatCurrency(quoteState.quote.quote.shippingFee, "VND")
                  : orderFormCopy.localMockQuote}
            </div>
          </div>
          {!isFormComplete ? (
            <p className="mt-3 text-xs text-amber-700">
              {orderFormCopy.submitDisabledAddress}
            </p>
          ) : !quoteState.canSubmit ? (
            <p className="mt-3 text-xs text-amber-700">
              {quoteState.error ?? orderFormCopy.submitDisabledQuote}
            </p>
          ) : null}
        </div>

        <div className="md:col-span-2">
          <Button
            className="h-12 min-w-56 font-black uppercase"
            disabled={!canSubmit}
            type="submit"
          >
            {isPending ? orderFormCopy.submitLoading : ctaLabel}
          </Button>
        </div>
      </form>

      {order ? (
        <p className="mt-4 rounded-xl bg-primary/8 px-4 py-3 text-sm text-on-surface">
          {orderFormCopy.orderCreated}: <strong>{order.reference}</strong>
          {order.pricing
            ? ` • ${orderFormCopy.totalQuoted} ${formatCurrency(order.pricing.total, order.pricing.currency)}`
            : ""}
        </p>
      ) : null}

      {error ? (
        <p className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </section>
  );
}
