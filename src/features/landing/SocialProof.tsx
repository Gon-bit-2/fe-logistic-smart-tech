/**
 * SocialProof component
 * Hiển thị logo đối tác theo bố cục ổn định, ưu tiên khả năng đọc.
 */
import { socialProofData } from "@/features/landing/data";

export default function SocialProof() {
  return (
    <section className="bg-surface-container-low px-8 py-12">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(220px,280px)_1fr] lg:items-center">
        <span className="text-center text-sm font-bold tracking-[0.2em] text-on-surface-variant/90 uppercase lg:text-left">
          Trusted by Industry Leaders
        </span>
        <div className="social-row flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-xl font-black tracking-tight text-on-surface-variant sm:text-2xl lg:justify-start">
          {socialProofData.map((client, index) => (
            <span
              key={index}
              className="social-name cursor-default text-on-surface-variant/80 transition-all duration-300 hover:-translate-y-1 hover:text-primary"
            >
              {client}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
