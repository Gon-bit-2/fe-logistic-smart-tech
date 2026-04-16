"use client";

import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DEFAULT_CREATE_ORDER_INPUT,
  calculateOrderPricing,
} from "@/features/orders/data/orderMockData";
import ServiceTierSelector from "@/features/orders/components/ServiceTierSelector";
import { useCreateOrder } from "@/features/orders/hooks/useCreateOrder";
import type {
  CreateOrderInput,
  OrderDTO,
  ServiceTier,
} from "@/features/orders/types/order.dto";
import { formatCurrency } from "@/utils/formatters";

type OrderFormProps = Readonly<{
  ctaLabel?: string;
  onSubmitSuccess?: (order: OrderDTO) => void;
  value?: CreateOrderInput;
  onChange?: (nextValue: CreateOrderInput) => void;
}>;

export default function OrderForm({
  ctaLabel = "Calculate Price & Continue",
  onSubmitSuccess,
  value,
  onChange,
}: OrderFormProps) {
  const { mutateAsync, isPending, order, error } = useCreateOrder();
  const [internalForm, setInternalForm] = useState(DEFAULT_CREATE_ORDER_INPUT);
  const form = value ?? internalForm;

  function updateForm(nextValue: CreateOrderInput) {
    setInternalForm(nextValue);
    onChange?.(nextValue);
  }

  function updateField<Key extends keyof CreateOrderInput>(
    key: Key,
    nextValue: CreateOrderInput[Key],
  ) {
    updateForm({
      ...form,
      [key]: nextValue,
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextOrder = await mutateAsync(form);
    onSubmitSuccess?.(nextOrder);
  }

  const pricing = calculateOrderPricing(form.serviceTier);

  return (
    <section className="rounded-xl bg-surface-container-lowest p-8 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)]">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black tracking-[0.16em] text-primary uppercase">
            Orders
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-on-surface">
            Create New Order
          </h3>
          <p className="mt-1 text-sm text-outline">
            Define your route, package profile, and service tier.
          </p>
        </div>
        <div className="hidden items-center gap-4 md:flex">
          {["Locations", "Details", "Service"].map((label, index) => (
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
          <label className="space-y-2 md:col-span-2">
            <span className="px-1 text-[10px] font-black tracking-[0.16em] text-outline uppercase">
              Customer
            </span>
            <Input
              value={form.customerName}
              onChange={(event) => updateField("customerName", event.target.value)}
              className="border-b border-outline-variant/25 pb-3 focus:rounded-lg"
            />
          </label>

          <label className="space-y-2">
            <span className="px-1 text-[10px] font-black tracking-[0.16em] text-outline uppercase">
              Pickup Address
            </span>
            <Input
              value={form.pickupAddress}
              onChange={(event) => updateField("pickupAddress", event.target.value)}
              className="border-b border-outline-variant/25 pb-3 focus:rounded-lg"
            />
          </label>

          <label className="space-y-2">
            <span className="px-1 text-[10px] font-black tracking-[0.16em] text-outline uppercase">
              Delivery Address
            </span>
            <Input
              value={form.deliveryAddress}
              onChange={(event) => updateField("deliveryAddress", event.target.value)}
              className="border-b border-outline-variant/25 pb-3 focus:rounded-lg"
            />
          </label>

          <label className="space-y-2">
            <span className="px-1 text-[10px] font-black tracking-[0.16em] text-outline uppercase">
              Contact Name
            </span>
            <Input
              value={form.contactName ?? ""}
              onChange={(event) => updateField("contactName", event.target.value)}
              className="border-b border-outline-variant/25 pb-3 focus:rounded-lg"
            />
          </label>

          <label className="space-y-2">
            <span className="px-1 text-[10px] font-black tracking-[0.16em] text-outline uppercase">
              Contact Phone
            </span>
            <Input
              value={form.contactPhone ?? ""}
              onChange={(event) => updateField("contactPhone", event.target.value)}
              className="border-b border-outline-variant/25 pb-3 focus:rounded-lg"
            />
          </label>

          <label className="space-y-2">
            <span className="px-1 text-[10px] font-black tracking-[0.16em] text-outline uppercase">
              Receiver Name
            </span>
            <Input
              value={form.receiverName ?? ""}
              onChange={(event) => updateField("receiverName", event.target.value)}
              className="border-b border-outline-variant/25 pb-3 focus:rounded-lg"
            />
          </label>

          <label className="space-y-2">
            <span className="px-1 text-[10px] font-black tracking-[0.16em] text-outline uppercase">
              Receiver Phone
            </span>
            <Input
              value={form.receiverPhone ?? ""}
              onChange={(event) => updateField("receiverPhone", event.target.value)}
              className="border-b border-outline-variant/25 pb-3 focus:rounded-lg"
            />
          </label>

          <label className="space-y-2">
            <span className="px-1 text-[10px] font-black tracking-[0.16em] text-outline uppercase">
              Weight (kg)
            </span>
            <Input
              type="number"
              value={form.packageWeightKg}
              onChange={(event) =>
                updateField("packageWeightKg", Number(event.target.value || 0))
              }
              className="border-b border-outline-variant/25 pb-3 focus:rounded-lg"
            />
          </label>

          <label className="space-y-2">
            <span className="px-1 text-[10px] font-black tracking-[0.16em] text-outline uppercase">
              Dimensions (cm)
            </span>
            <Input
              value={form.packageDimensions}
              onChange={(event) =>
                updateField("packageDimensions", event.target.value)
              }
              className="border-b border-outline-variant/25 pb-3 focus:rounded-lg"
            />
          </label>

          <label className="space-y-2">
            <span className="px-1 text-[10px] font-black tracking-[0.16em] text-outline uppercase">
              Declared Value
            </span>
            <Input
              type="number"
              value={form.declaredValueUsd}
              onChange={(event) =>
                updateField("declaredValueUsd", Number(event.target.value || 0))
              }
              className="border-b border-outline-variant/25 pb-3 focus:rounded-lg"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="px-1 text-[10px] font-black tracking-[0.16em] text-outline uppercase">
              Item Description
            </span>
            <textarea
              value={form.itemDescription ?? ""}
              onChange={(event) => updateField("itemDescription", event.target.value)}
              className="min-h-24 w-full rounded-xl border border-outline-variant/15 bg-surface px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/8"
            />
          </label>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-black tracking-[0.16em] text-outline uppercase">
            Select Service Tier
          </p>
          <ServiceTierSelector
            value={form.serviceTier}
            onChange={(nextValue: ServiceTier) => updateField("serviceTier", nextValue)}
          />
        </div>

        <div className="flex items-center justify-between rounded-xl bg-surface-container-low px-4 py-4">
          <div>
            <p className="text-sm font-semibold text-on-surface">Projected total</p>
            <p className="text-xs text-on-surface-variant">
              Includes handling, VAT, and Eco-Green discount where applicable.
            </p>
          </div>
          <div className="text-xl font-black text-primary">
            {formatCurrency(pricing.total)}
          </div>
        </div>

        <div className="md:col-span-2">
          <Button className="h-12 min-w-56 font-black uppercase" type="submit">
            {isPending ? "Submitting..." : ctaLabel}
          </Button>
        </div>
      </form>

      {order ? (
        <p className="mt-4 rounded-xl bg-primary/8 px-4 py-3 text-sm text-on-surface">
          Draft order created: <strong>{order.reference}</strong>
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
