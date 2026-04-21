import { IntegrationPendingState } from "@/components/ui/data-states";
import { testimonialSectionCopy } from "@/i18n/vi";

export default function TestimonialSection() {
  return (
    <section id="about" className="px-8 py-32">
      <div className="mx-auto max-w-4xl">
        <IntegrationPendingState
          title={testimonialSectionCopy.title}
          description={testimonialSectionCopy.description}
        />
      </div>
    </section>
  );
}
