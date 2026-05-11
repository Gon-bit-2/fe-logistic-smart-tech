"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLandingReveal } from "@/features/landing/presentation/components/useLandingReveal";
import { useViewportSceneMount } from "@/features/landing/presentation/components/useDeferredSceneMount";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type SustainabilitySceneState = {
  carbonLevel: number;
  val: number;
};

type ImpactStat = {
  label: string;
  value: string;
};

const SustainabilityParticleScene = dynamic(
  () => import("@/components/3d/SustainabilityParticleScene"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(111,251,190,0.18),transparent_58%)]" />
    ),
  },
);

export default function SustainabilitySection() {
  const t = useTranslations("landing.sustainability");
  const impactStats = t.raw("impactStats") as ImpactStat[];
  const commitments = t.raw("commitments") as string[];
  const sectionRef = useRef<HTMLElement>(null);
  const sceneViewportRef = useRef<HTMLDivElement>(null);
  const sceneStateRef = useRef<SustainabilitySceneState>({
    carbonLevel: 0.2,
    val: 0,
  });
  const shouldMountScene = useViewportSceneMount(sceneViewportRef, "280px 0px");

  useLandingReveal(sectionRef);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      gsap.to(sceneStateRef.current, {
        carbonLevel: 0.95,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: true,
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="sustainability"
      ref={sectionRef}
      className="relative overflow-hidden bg-[linear-gradient(180deg,#eefaf2_0%,#ecf7ef_48%,#effbf4_100%)] px-6 py-28 md:px-8"
    >
      <div className="pointer-events-none absolute left-[-10%] top-24 h-72 w-72 rounded-full bg-primary-fixed/18 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-[-8%] h-96 w-96 rounded-full bg-emerald-500/8 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-8">
          <div data-reveal className="space-y-5">
            <Badge variant="outline" className="border-primary/15 bg-white/70 px-3 py-1 text-[11px] font-bold tracking-[0.24em] uppercase text-primary">
              {t("eyebrow")}
            </Badge>
            <h2 className="max-w-xl text-4xl font-black leading-[1.04] tracking-tight text-on-surface md:text-7xl">
              {t("title")}{" "}
              <span className="text-primary">
                {t("titleHighlight")}
              </span>
            </h2>
            <p className="max-w-2xl text-lg leading-8 text-on-surface-variant">
              {t("description")}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {impactStats.map((stat) => (
              <Card
                key={stat.label}
                data-reveal
                className="border-white/75 bg-white/78 py-0 shadow-[0_28px_70px_-48px_rgba(0,84,58,0.45)]"
              >
                <CardContent className="p-5">
                  <div className="text-3xl font-black tracking-tight text-primary">
                    {stat.value}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card
            data-reveal
            className="border-white/75 bg-white/82 py-0 shadow-[0_32px_80px_-54px_rgba(0,84,58,0.4)]"
          >
            <CardContent className="p-6 md:p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black tracking-[0.24em] text-primary uppercase">
                    {t("pendingTitle")}
                  </p>
                  <p className="mt-2 max-w-xl text-sm leading-7 text-on-surface-variant md:text-base">
                    {t("pendingDescription")}
                  </p>
                </div>
                <div className="hidden rounded-full bg-primary-fixed/40 px-4 py-2 text-sm font-bold text-primary md:block">
                  {t("esgBadge")}
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                {commitments.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl bg-surface-container-low px-4 py-3"
                  >
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                    <p className="text-sm leading-7 text-on-surface">{item}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div ref={sceneViewportRef} data-reveal className="relative mx-auto w-full max-w-[720px]">
          <div className="absolute inset-0 rounded-[2.4rem] bg-[radial-gradient(circle_at_center,rgba(111,251,190,0.2),transparent_56%)] blur-3xl" />
          <div className="relative aspect-square overflow-hidden rounded-[2.6rem] border border-white/60 bg-white/38 shadow-[0_44px_120px_-54px_rgba(0,73,48,0.45)] backdrop-blur-xl">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.55),rgba(255,255,255,0.22))]" />
            <div className="absolute inset-6 rounded-[2rem] border border-primary/10" />
            <div className="absolute inset-0">
              {shouldMountScene ? (
                <SustainabilityParticleScene sceneStateRef={sceneStateRef} />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(111,251,190,0.18),transparent_58%)]" />
              )}
            </div>

            <div className="absolute left-6 top-6 rounded-2xl border border-white/65 bg-white/78 px-4 py-3 shadow-lg backdrop-blur-xl">
              <p className="text-xs font-black tracking-[0.22em] text-primary uppercase">
                {t("routingEyebrow")}
              </p>
              <p className="mt-1 text-sm text-on-surface-variant">
                {t("routingDescription")}
              </p>
            </div>

            <div className="absolute bottom-6 right-6 rounded-2xl border border-[#1a4f3d]/10 bg-[#0d2f23] px-5 py-4 text-white shadow-2xl">
              <p className="text-xs font-black tracking-[0.24em] text-primary-fixed uppercase">
                {t("emissionScoreLabel")}
              </p>
              <div className="mt-2 text-4xl font-black text-primary-fixed">A+</div>
              <p className="mt-1 text-sm text-white/70">{t("emissionScoreDescription")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
