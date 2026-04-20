"use client";

/**
 * CallToAction component
 * Glass CTA staged over the warehouse background from Stitch.
 */
import React, { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ctaData } from "@/i18n/vi";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function CallToAction() {
  const sectionRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(contentRef.current, {
        y: 50,
        opacity: 0,
        scale: 0.95,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      const parallaxTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      if (backgroundRef.current) {
        parallaxTimeline.to(
          backgroundRef.current,
          { yPercent: -8, scale: 1.06, ease: "none" },
          0,
        );
      }

      if (contentRef.current) {
        parallaxTimeline.to(
          contentRef.current,
          { yPercent: -6, ease: "none" },
          0,
        );
      }
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="px-8 pb-32">
      <div className="mx-auto max-w-7xl">
        <div className="relative isolate flex h-[640px] items-center justify-center overflow-hidden rounded-[2rem] bg-[#051710]">
          <div
            ref={backgroundRef}
            className="absolute inset-[-4%] will-change-transform"
            style={{
              background:
                "radial-gradient(circle at top, rgba(111,251,190,0.16), transparent 30%), linear-gradient(135deg, rgba(1,24,18,0.88), rgba(5,47,36,0.94) 55%, rgba(10,77,55,0.82))",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(111,251,190,0.16),transparent_34%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,19,14,0.22),rgba(3,19,14,0.36)_28%,rgba(2,16,12,0.7)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,16,12,0.58),rgba(2,16,12,0.12)_40%,rgba(2,16,12,0.44)_100%)]" />
          <div className="pointer-events-none absolute left-[8%] top-[12%] h-48 w-48 rounded-full bg-primary-fixed/8 blur-3xl" />
          <div className="pointer-events-none absolute right-[9%] bottom-[10%] h-56 w-56 rounded-full bg-emerald-400/8 blur-3xl" />

          <div
            ref={contentRef}
            className="relative z-10 max-w-3xl rounded-[1.75rem] border border-white/15 bg-white/8 px-6 py-12 text-center shadow-[0_40px_120px_-42px_rgba(0,0,0,0.75)] backdrop-blur-md sm:px-10 md:px-16"
          >
            <div className="mx-auto mb-5 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-black tracking-[0.32em] text-primary-fixed uppercase">
              Build A Lower-Carbon Network
            </div>

            <h2 className="text-4xl font-black tracking-tight text-white drop-shadow-lg md:text-6xl">
              {ctaData.title}
            </h2>
            <p className="mt-6 text-xl leading-relaxed text-white/88 drop-shadow-md">
              {ctaData.description}
            </p>

            <div className="pt-8">
              <Button
                asChild
                size="lg"
                className="rounded-lg bg-primary-fixed px-12 py-7 text-lg font-black tracking-widest text-on-primary-fixed uppercase shadow-2xl transition-all hover:bg-primary-fixed hover:brightness-110 active:scale-95"
              >
                <Link href="/dashboard">
                  {ctaData.buttonText}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
