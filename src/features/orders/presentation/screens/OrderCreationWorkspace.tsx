"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import OperationsTopBar from "@/components/layout/OperationsTopBar";
import { createEmptyOrderInput } from "@/features/orders/domain/value-objects/order-form";
import type {
  CreateOrderInput,
  OrderDTO,
} from "@/features/orders/domain/types/order.types";
import OrderForm from "@/features/orders/presentation/components/OrderForm";
import RoutePreviewCard from "@/features/orders/presentation/components/RoutePreviewCard";
import { useOrderQuote } from "@/features/orders/presentation/hooks/useOrderQuote";
import { localizePath, type Locale } from "@/i18n/config";

type OrderCreationWorkspaceProps = Readonly<{
  showTopBar?: boolean;
}>;

export default function OrderCreationWorkspace({
  showTopBar = true,
}: OrderCreationWorkspaceProps) {
  const tWorkspace = useTranslations("orders.creationWorkspace");
  const router = useRouter();
  const locale = useLocale() as Locale;
  const [form, setForm] = useState<CreateOrderInput>(createEmptyOrderInput);
  const quoteState = useOrderQuote(form);

  function handleSubmitSuccess(order: OrderDTO) {
    if (order.payment?.method === "COD") {
      const destination = localizePath(
        `/tracking/${order.trackingCode ?? order.reference}`,
        locale,
      );
      router.push(destination);
      window.location.assign(destination);
      return;
    }

    const checkoutUrl = `${localizePath("/checkout", locale)}?orderId=${order.id}`;
    router.push(checkoutUrl);
    window.location.assign(checkoutUrl);
  }

  return (
    <div className="min-h-screen bg-surface">
      {showTopBar ? <OperationsTopBar active="shipments" /> : null}
      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 md:px-8 lg:grid lg:grid-cols-[1fr_0.9fr]">
        <OrderForm
          value={form}
          onChange={setForm}
          onSubmitSuccess={handleSubmitSuccess}
          ctaLabel={tWorkspace("ctaLabel")}
          quoteState={quoteState}
        />
        <RoutePreviewCard form={form} quoteState={quoteState} />
      </main>
    </div>
  );
}
