"use client";

import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCreateOrder } from "@/features/orders/hooks/useCreateOrder";

export default function OrderForm() {
  const { mutateAsync, isPending, order, error } = useCreateOrder();
  const [form, setForm] = useState({
    customerName: "Green Retail Co.",
    pickupAddress: "Thu Duc Hub, Ho Chi Minh City",
    deliveryAddress: "District 7 Distribution Center",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await mutateAsync(form);
  }

  return (
    <section className="rounded-[1.5rem] border border-border bg-card p-6">
      <div className="mb-5">
        <p className="text-xs font-black tracking-[0.28em] text-primary uppercase">
          Orders
        </p>
        <h3 className="mt-2 text-2xl font-black tracking-tight text-on-surface">
          Create delivery order
        </h3>
      </div>

      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-on-surface">Customer</span>
          <input
            value={form.customerName}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                customerName: event.target.value,
              }))
            }
            className="w-full rounded-xl border border-border bg-background px-4 py-3"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-on-surface">Pickup</span>
          <input
            value={form.pickupAddress}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                pickupAddress: event.target.value,
              }))
            }
            className="w-full rounded-xl border border-border bg-background px-4 py-3"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-on-surface">Delivery</span>
          <input
            value={form.deliveryAddress}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                deliveryAddress: event.target.value,
              }))
            }
            className="w-full rounded-xl border border-border bg-background px-4 py-3"
          />
        </label>

        <div className="md:col-span-2">
          <Button className="h-11 min-w-44 font-black uppercase" type="submit">
            {isPending ? "Submitting..." : "Create Order"}
          </Button>
        </div>
      </form>

      {order ? (
        <p className="mt-4 rounded-xl bg-primary/8 px-4 py-3 text-sm text-on-surface">
          Scaffold order created: <strong>{order.reference}</strong>
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
