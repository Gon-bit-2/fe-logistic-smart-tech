"use client";

import { IntegrationPendingState } from "@/components/ui/data-states";
import { sustainabilitySectionCopy } from "@/i18n/vi";

export default function SustainabilitySection() {
  return (
    <section className="relative overflow-hidden bg-surface-container-low px-8 py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-20 lg:grid-cols-2">
        <div className="order-2 space-y-10 lg:order-1">
          <h2 className="text-4xl md:text-6xl font-black text-on-surface leading-tight tracking-tighter">
            {sustainabilitySectionCopy.title}{" "}
            <span className="text-primary">
              {sustainabilitySectionCopy.titleHighlight}
            </span>
          </h2>
          <p className="text-xl text-on-surface-variant leading-relaxed">
            {sustainabilitySectionCopy.description}
          </p>
          <IntegrationPendingState
            title={sustainabilitySectionCopy.pendingTitle}
            description={sustainabilitySectionCopy.pendingDescription}
          />
        </div>

        <div className="relative order-1 mx-auto aspect-square w-full max-w-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(111,251,190,0.16),transparent_62%)] lg:order-2">
          <div className="absolute inset-4 rounded-full bg-surface-container blur-3xl opacity-50" />
          <div className="absolute inset-10 rounded-full border border-primary/10" />
        </div>
      </div>
    </section>
  );
}

