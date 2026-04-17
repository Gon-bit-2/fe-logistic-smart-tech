"use client";

import { IntegrationPendingState } from "@/components/ui/data-states";
import { featuresSectionCopy } from "@/i18n/vi";

export default function FeaturesSection() {
  return (
    <section className="bg-surface px-8 py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 space-y-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-on-surface">
            {featuresSectionCopy.title}{" "}
            <span className="text-primary">{featuresSectionCopy.titleHighlight}</span>
          </h2>
          <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">
            {featuresSectionCopy.description}
          </p>
        </div>
        <IntegrationPendingState
          title={featuresSectionCopy.pendingTitle}
          description={featuresSectionCopy.pendingDescription}
        />
      </div>
    </section>
  );
}

