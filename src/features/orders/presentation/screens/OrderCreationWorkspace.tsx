"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OperationsTopBar from "@/components/layout/OperationsTopBar";
import { createEmptyOrderInput } from "@/features/orders/domain/value-objects/order-form";
import type {
  CreateOrderInput,
  OrderDTO,
} from "@/features/orders/domain/types/order.types";
import OrderForm from "@/features/orders/presentation/components/OrderForm";
import RoutePreviewCard from "@/features/orders/presentation/components/RoutePreviewCard";
import { orderCreationWorkspaceCopy } from "@/i18n/vi";

export default function OrderCreationWorkspace() {
  const router = useRouter();
  const [form, setForm] = useState<CreateOrderInput>(createEmptyOrderInput);

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
          ctaLabel={orderCreationWorkspaceCopy.ctaLabel}
        />
        <RoutePreviewCard form={form} />
      </main>
    </div>
  );
}

