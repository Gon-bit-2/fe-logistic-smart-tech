"use client";

import { type FormEvent, useState } from "react";
import { Banknote, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  PageHeader,
  SectionCard,
} from "@/features/admin/presentation/components/admin-primitives";
import { useReconcileCod } from "@/features/wallet/presentation/hooks/useWallet";
import { useI18nCopy } from "@/i18n/useCopy";
import { formatCurrency } from "@/utils/formatters";

const INITIAL_FORM = {
  amount: "",
  description: "",
  driverId: "",
  referenceId: "",
};

export default function CodReconciliationScreen() {
  const { walletScreenCopy } = useI18nCopy();
  const reconcileCod = useReconcileCod();
  const [form, setForm] = useState(INITIAL_FORM);
  const [message, setMessage] = useState<string | null>(null);

  const amount = Number(form.amount);
  const driverId = Number(form.driverId);
  const canSubmit =
    Number.isFinite(amount) &&
    amount > 0 &&
    Number.isInteger(driverId) &&
    driverId > 0 &&
    form.referenceId.trim().length > 0 &&
    !reconcileCod.isPending;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    setMessage(null);
    await reconcileCod.mutateAsync({
      amount,
      description: form.description,
      driverId,
      referenceId: form.referenceId,
    });
    setMessage(walletScreenCopy.reconciliation.successMessage);
    setForm(INITIAL_FORM);
  }

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow={walletScreenCopy.reconciliation.eyebrow}
        title={walletScreenCopy.reconciliation.title}
        description={walletScreenCopy.reconciliation.description}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <SectionCard className="p-6">
          <form onSubmit={(event) => void handleSubmit(event)} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-on-surface/45">
                  {walletScreenCopy.fields.driverId}
                </span>
                <Input
                  inputMode="numeric"
                  min={1}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      driverId: event.target.value,
                    }))
                  }
                  type="number"
                  value={form.driverId}
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-on-surface/45">
                  {walletScreenCopy.fields.amount}
                </span>
                <Input
                  inputMode="decimal"
                  min={1}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      amount: event.target.value,
                    }))
                  }
                  type="number"
                  value={form.amount}
                />
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-on-surface/45">
                {walletScreenCopy.fields.referenceId}
              </span>
              <Input
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    referenceId: event.target.value,
                  }))
                }
                value={form.referenceId}
              />
            </label>

            <label className="block space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-on-surface/45">
                {walletScreenCopy.fields.description}
              </span>
              <Textarea
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                value={form.description}
              />
            </label>

            {reconcileCod.error ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {reconcileCod.error.message}
              </p>
            ) : null}
            {message ? (
              <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                {message}
              </p>
            ) : null}

            <Button disabled={!canSubmit} type="submit">
              {reconcileCod.isPending ? (
                <RefreshCw className="mr-2 size-4 animate-spin" />
              ) : (
                <Banknote className="mr-2 size-4" />
              )}
              {walletScreenCopy.actions.reconcile}
            </Button>
          </form>
        </SectionCard>

        <SectionCard className="p-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
            {walletScreenCopy.reconciliation.previewEyebrow}
          </p>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-on-surface">
            {formatCurrency(Number.isFinite(amount) ? amount : 0, "VND")}
          </h2>
          <p className="mt-4 text-sm leading-6 text-on-surface/60">
            {walletScreenCopy.reconciliation.previewDescription}
          </p>
        </SectionCard>
      </div>
    </div>
  );
}
