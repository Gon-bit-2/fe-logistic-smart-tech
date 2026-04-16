"use client";

import OperationsTopBar from "@/components/layout/OperationsTopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCheckout } from "@/features/orders/hooks/useCheckout";
import { formatCurrency } from "@/utils/formatters";

export default function CheckoutScreen() {
  const {
    order,
    paymentMethod,
    setPaymentMethod,
    cardState,
    updateCardState,
    confirmCheckout,
    isSubmitting,
    error,
  } = useCheckout();

  const pricing = order.pricing;

  return (
    <div className="min-h-screen bg-surface">
      <OperationsTopBar active="shipments" />
      <main className="mx-auto max-w-7xl px-6 py-10 md:px-8">
        <div className="mb-12">
          <h1 className="text-[2.75rem] font-black tracking-tight text-on-surface">
            Checkout
          </h1>
          <p className="mt-2 font-medium text-slate-500">
            Finalize shipment {order.reference} and confirm your delivery schedule.
          </p>
        </div>

        <div className="grid items-start gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-8">
            <section className="rounded-xl bg-surface-container-lowest p-8 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.06)]">
              <div className="mb-8 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <h2 className="text-xl font-black tracking-tight text-on-surface">
                  Payment Details
                </h2>
              </div>

              <div className="space-y-6">
                {paymentMethod === "card" ? (
                  <>
                    <label className="block space-y-2">
                      <span className="ml-1 text-xs font-black tracking-[0.14em] text-slate-500 uppercase">
                        Card Number
                      </span>
                      <Input
                        value={cardState.cardNumber}
                        onChange={(event) =>
                          updateCardState({ cardNumber: event.target.value })
                        }
                        className="border-b border-outline-variant/20 pb-4 focus:rounded-lg"
                        placeholder="0000 0000 0000 0000"
                      />
                    </label>

                    <div className="grid gap-8 md:grid-cols-2">
                      <label className="block space-y-2">
                        <span className="ml-1 text-xs font-black tracking-[0.14em] text-slate-500 uppercase">
                          Expiry Date
                        </span>
                        <Input
                          value={cardState.expiryDate}
                          onChange={(event) =>
                            updateCardState({ expiryDate: event.target.value })
                          }
                          className="border-b border-outline-variant/20 pb-4 focus:rounded-lg"
                          placeholder="MM / YY"
                        />
                      </label>

                      <label className="block space-y-2">
                        <span className="ml-1 text-xs font-black tracking-[0.14em] text-slate-500 uppercase">
                          CVC
                        </span>
                        <Input
                          value={cardState.cvc}
                          onChange={(event) => updateCardState({ cvc: event.target.value })}
                          className="border-b border-outline-variant/20 pb-4 focus:rounded-lg"
                          placeholder="123"
                        />
                      </label>
                    </div>
                  </>
                ) : null}

                <div className="space-y-4 border-t border-outline-variant/10 pt-8">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`flex w-full items-center gap-4 rounded-lg p-4 text-left transition ${
                      paymentMethod === "card"
                        ? "bg-surface-container-low"
                        : "hover:bg-surface-container-low"
                    }`}
                  >
                    <div
                      className={`relative h-5 w-5 rounded-full border-2 ${
                        paymentMethod === "card"
                          ? "border-primary"
                          : "border-outline-variant"
                      }`}
                    >
                      <div
                        className={`absolute inset-1 rounded-full bg-primary transition ${
                          paymentMethod === "card" ? "scale-100" : "scale-0"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-on-surface">Card Payment</p>
                      <p className="text-sm text-slate-500">
                        Pay securely now and release the shipment immediately.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cash_on_delivery")}
                    className={`flex w-full items-center gap-4 rounded-lg p-4 text-left transition ${
                      paymentMethod === "cash_on_delivery"
                        ? "bg-surface-container-low"
                        : "hover:bg-surface-container-low"
                    }`}
                  >
                    <div
                      className={`relative h-5 w-5 rounded-full border-2 ${
                        paymentMethod === "cash_on_delivery"
                          ? "border-primary"
                          : "border-outline-variant"
                      }`}
                    >
                      <div
                        className={`absolute inset-1 rounded-full bg-primary transition ${
                          paymentMethod === "cash_on_delivery"
                            ? "scale-100"
                            : "scale-0"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-on-surface">Cash on Delivery</p>
                      <p className="text-sm text-slate-500">
                        Pay when the package arrives at the destination.
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </section>

            <div className="flex items-center gap-6 rounded-xl bg-surface-container-low p-6">
              <span className="material-symbols-outlined text-3xl text-tertiary">
                verified_user
              </span>
              <div>
                <p className="font-bold text-on-surface-variant">
                  Insurance Protection Included
                </p>
                <p className="text-sm text-slate-500">
                  All shipments are covered up to $500.00 against transit damage or
                  loss.
                </p>
              </div>
            </div>
          </div>

          <aside className="space-y-8 lg:sticky lg:top-24">
            <div className="rounded-xl bg-surface-container-lowest p-8 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)]">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-xl font-black tracking-tight text-on-surface">
                  Order Summary
                </h2>
                <span className="material-symbols-outlined text-slate-300">
                  receipt_long
                </span>
              </div>

              <div className="space-y-4 text-on-surface-variant">
                <div className="flex justify-between">
                  <span>Logistics Fee</span>
                  <span className="font-medium">
                    {formatCurrency(pricing?.logisticsFee ?? 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping & Handling</span>
                  <span className="font-medium">
                    {formatCurrency(pricing?.handlingFee ?? 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-primary/10 px-3 py-2">
                  <span className="text-sm font-semibold text-primary">
                    Eco-Green Service Discount
                  </span>
                  <span className="font-black text-primary">
                    -{formatCurrency(pricing?.ecoDiscount ?? 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (5%)</span>
                  <span className="font-medium">
                    {formatCurrency(pricing?.vat ?? 0)}
                  </span>
                </div>
              </div>

              <div className="my-8 border-t border-dashed border-outline-variant/30 pt-6">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-black tracking-[0.16em] text-slate-400 uppercase">
                      Total Amount
                    </p>
                    <p className="mt-1 text-3xl font-black tracking-tight text-on-surface">
                      {formatCurrency(pricing?.total ?? 0)}
                    </p>
                  </div>
                  <span className="rounded-full bg-secondary-container px-3 py-1 text-[10px] font-black tracking-[0.12em] text-on-secondary-container uppercase">
                    USD Currency
                  </span>
                </div>
              </div>

              <Button
                onClick={confirmCheckout}
                className="h-14 w-full bg-gradient-to-br from-tertiary to-tertiary-container text-base font-black text-white"
              >
                {isSubmitting
                  ? "Processing..."
                  : paymentMethod === "cash_on_delivery"
                    ? "Confirm COD Order"
                    : "Pay & Confirm Order"}
              </Button>

              {error ? (
                <p className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </p>
              ) : null}
            </div>

            <div className="relative rounded-xl bg-surface-container-high p-6">
              <div className="absolute -right-4 -top-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <span
                  className="material-symbols-outlined text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  eco
                </span>
              </div>
              <h3 className="mb-2 text-sm font-black text-primary">
                Sustainable Choice
              </h3>
              <p className="text-xs leading-6 text-on-surface-variant">
                By selecting the {order.serviceTier ?? "Eco-Green"} service, this
                shipment saves approximately {order.co2SavedKg}kg of CO2.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
