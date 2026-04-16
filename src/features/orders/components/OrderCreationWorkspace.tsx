"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OperationsTopBar from "@/components/layout/OperationsTopBar";
import OrderForm from "@/features/orders/components/OrderForm";
import RoutePreviewCard from "@/features/orders/components/RoutePreviewCard";
import { DEFAULT_CREATE_ORDER_INPUT } from "@/features/orders/data/orderMockData";
import type {
  CreateOrderInput,
  OrderDTO,
} from "@/features/orders/types/order.dto";

export default function OrderCreationWorkspace() {
  const router = useRouter();
  const [form, setForm] = useState<CreateOrderInput>(DEFAULT_CREATE_ORDER_INPUT);

  function handleSubmitSuccess(order: OrderDTO) {
    router.push(`/checkout?orderId=${order.id}`);
  }

  return (
    <div className="min-h-screen bg-surface">
      <OperationsTopBar active="shipments" />
      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 md:px-8 lg:grid lg:grid-cols-[1fr_0.9fr]">
        <OrderForm
          value={form}
          onChange={setForm}
          onSubmitSuccess={handleSubmitSuccess}
          ctaLabel="Calculate Price & Continue"
        />
        <RoutePreviewCard form={form} />
      </main>
    </div>
  );
}
