"use client";

import { Link } from "@/i18n/routing";
import { CreditCard, PackageCheck, RefreshCw, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ErrorState, LoadingState } from "@/components/ui/data-states";
import {
  MetricCard,
  PageHeader,
  SectionCard,
  StatusBadge,
} from "@/features/admin/presentation/components/admin-primitives";
import { useMyWalletQuery } from "@/features/wallet/presentation/hooks/useWallet";
import { useI18nCopy } from "@/i18n/useCopy";
import { formatCurrency, formatDate } from "@/utils/formatters";

function getWalletTone(status: string) {
  return status === "BLOCKED" ? "red" : "green";
}

export default function DriverWalletScreen() {
  const { walletScreenCopy } = useI18nCopy();
  const walletQuery = useMyWalletQuery();
  const wallet = walletQuery.data;

  if (walletQuery.isLoading) {
    return (
      <LoadingState
        title={walletScreenCopy.driver.loadingTitle}
        description={walletScreenCopy.driver.loadingDescription}
      />
    );
  }

  if (walletQuery.isError) {
    return (
      <ErrorState
        title={walletScreenCopy.driver.errorTitle}
        description={walletQuery.error.message}
        action={
          <Button onClick={() => void walletQuery.refetch()} variant="outline">
            {walletScreenCopy.actions.retry}
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow={walletScreenCopy.driver.eyebrow}
        title={walletScreenCopy.driver.title}
        description={walletScreenCopy.driver.description}
        actions={
          <Button onClick={() => void walletQuery.refetch()} variant="outline">
            <RefreshCw className="mr-2 size-4" />
            {walletScreenCopy.actions.refresh}
          </Button>
        }
      />

      <div className="grid gap-5 md:grid-cols-3">
        <MetricCard
          icon={<CreditCard className="size-6" />}
          label={walletScreenCopy.metrics.balance}
          value={formatCurrency(wallet?.balance ?? 0, "VND")}
        />
        <MetricCard
          accent="blue"
          icon={<PackageCheck className="size-6" />}
          label={walletScreenCopy.metrics.codCollected}
          value={formatCurrency(wallet?.codCollected ?? 0, "VND")}
        />
        <SectionCard className="flex items-center justify-between p-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-on-surface/45">
              {walletScreenCopy.metrics.status}
            </p>
            <div className="mt-3">
              <StatusBadge
                label={wallet?.status ?? "ACTIVE"}
                tone={getWalletTone(wallet?.status ?? "ACTIVE")}
              />
            </div>
          </div>
          <Badge className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            COD
          </Badge>
        </SectionCard>
      </div>

      <SectionCard className="p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight text-on-surface">
              {walletScreenCopy.driver.codTitle}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-on-surface/60">
              {walletScreenCopy.driver.codDescription}
            </p>
            {wallet?.updatedAt ? (
              <p className="mt-3 text-xs font-semibold text-on-surface/45">
                {walletScreenCopy.driver.lastUpdated}: {formatDate(wallet.updatedAt)}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/dashboard/driver/trips">
                <Route className="mr-2 size-4" />
                {walletScreenCopy.actions.openTrips}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/driver/vehicle">
                {walletScreenCopy.actions.openVehicle}
              </Link>
            </Button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
