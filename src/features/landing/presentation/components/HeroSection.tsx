"use client";

/**
 * HeroSection component
 * 3D logistics globe hero with GSAP-driven camera motion.
 */
import React, { useRef } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import AppIcon from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIdleSceneMount } from "@/features/landing/presentation/components/useDeferredSceneMount";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type HeroSceneState = {
  progress: number;
};

const HeroLogisticsScene = dynamic(
  () => import("@/components/3d/HeroLogisticsScene"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(111,251,190,0.18),transparent_58%)]" />
    ),
  },
);

export default function HeroSection() {
  const t = useTranslations("landing.hero");
  const containerRef = useRef<HTMLElement>(null);
  const sceneStateRef = useRef<HeroSceneState>({ progress: 0 });
  const shouldMountScene = useIdleSceneMount();

  useGSAP(
    () => {
      sceneStateRef.current.progress = 0;

      gsap.from(".hero-anim", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.2,
      });

      gsap.to(sceneStateRef.current, {
        progress: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#03140f]"
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        {shouldMountScene ? (
          <HeroLogisticsScene sceneStateRef={sceneStateRef} />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(111,251,190,0.18),transparent_58%)]" />
        )}
      </div>

      <div className="pointer-events-none absolute left-[-10%] top-[15%] z-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-12%] right-[-8%] z-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_38%)]" />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#02100c]/40 via-[#03140f]/55 to-emerald-950/92" />

      <div className="relative z-10 mx-auto max-w-5xl px-8 pt-20 text-center">
        <h1 className="hero-anim mb-8 text-5xl leading-[1.1] font-extrabold tracking-tighter text-white md:text-8xl">
          {t("titleLine1")} <br />
          <span className="text-primary-fixed italic">
            {t("titleLine2")}
          </span>
        </h1>

        <p className="hero-anim mx-auto mb-12 max-w-2xl text-xl font-medium text-white/80 md:text-2xl">
          {t("description")}
        </p>

        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
          <Button asChild className="hero-anim w-full rounded-lg bg-primary-fixed px-10 py-7 text-sm font-black tracking-widest text-on-primary-fixed uppercase shadow-xl transition-all hover:bg-primary-fixed hover:brightness-110 active:scale-95 sm:w-auto">
            <Link href="/dashboard">
              {t("primaryCta")}
            </Link>
          </Button>
          <Button className="hero-anim flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-10 py-7 text-sm font-black tracking-widest text-white uppercase backdrop-blur-md transition-all hover:bg-white/20 sm:w-auto">
            <AppIcon name="play_circle" />
            {t("secondaryCta")}
          </Button>
        </div>

        <div className="hero-anim mt-16 text-sm font-bold tracking-widest text-white/60 uppercase">
          {t("trustedHint")}
        </div>
      </div>
    </section>
  );
}
