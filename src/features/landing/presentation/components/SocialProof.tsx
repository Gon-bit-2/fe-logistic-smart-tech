/**
 * SocialProof component
 * Hiển thị logo đối tác theo bố cục ổn định, ưu tiên khả năng đọc.
 */
import { IntegrationPendingState } from "@/components/ui/data-states";
import { socialProofCopy } from "@/i18n/vi";

export default function SocialProof() {
  return (
    <section className="bg-surface-container-low px-8 py-12">
      <div className="mx-auto max-w-7xl">
        <IntegrationPendingState
          title={socialProofCopy.title}
          description={socialProofCopy.description}
        />
      </div>
    </section>
  );
}

