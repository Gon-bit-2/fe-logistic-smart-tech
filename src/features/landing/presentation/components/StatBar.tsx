import { IntegrationPendingState } from "@/components/ui/data-states";
import { statBarCopy } from "@/i18n/vi";

export default function StatBar() {
  return (
    <section className="bg-emerald-950 px-8 py-20">
      <div className="mx-auto max-w-7xl">
        <IntegrationPendingState
          className="border-white/10 bg-white/[0.04]"
          title={statBarCopy.title}
          description={statBarCopy.description}
        />
      </div>
    </section>
  );
}
