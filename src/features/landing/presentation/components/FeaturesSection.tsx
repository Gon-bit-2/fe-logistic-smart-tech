"use client";

import React, { useRef } from "react";
import { BrainCircuit, Route, ShieldCheck, TimerReset } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLandingReveal } from "@/features/landing/presentation/components/useLandingReveal";

const iconMap = {
  brain: BrainCircuit,
  route: Route,
  shield: ShieldCheck,
} as const;

type FeatureCard = {
  description: string;
  icon: keyof typeof iconMap;
  metric: string;
  title: string;
};

type DashboardStat = {
  label: string;
  value: string;
};

type BoardMetric = {
  fill: string;
  label: string;
  value: string;
};

export default function FeaturesSection() {
  const t = useTranslations("landing.features");
  const featureCards = t.raw("featureCards") as FeatureCard[];
  const dashboardStats = t.raw("dashboardStats") as DashboardStat[];
  const boardMetrics = t.raw("boardMetrics") as BoardMetric[];
  const sectionRef = useRef<HTMLElement>(null);

  useLandingReveal(sectionRef);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(111,251,190,0.18),transparent_30%),linear-gradient(180deg,#effbf3_0%,#e9f5ed_100%)] px-6 py-28 md:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div data-reveal className="mx-auto max-w-3xl space-y-5 text-center">
          <Badge variant="outline" className="border-primary/15 bg-white/65 px-3 py-1 text-[11px] font-bold tracking-[0.24em] uppercase text-primary">
            {t("eyebrow")}
          </Badge>
          <h2 className="text-4xl font-black tracking-tight text-on-surface md:text-6xl">
            {t("title")}{" "}
            <span className="text-primary">{t("titleHighlight")}</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-on-surface-variant">
            {t("description")}
          </p>
        </div>

        <div className="mt-16 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featureCards.map((feature) => {
              const Icon = iconMap[feature.icon];

              return (
                <Card
                  key={feature.title}
                  data-reveal
                  className="border-white/70 bg-white/78 py-0 shadow-[0_32px_80px_-52px_rgba(0,84,58,0.45)] backdrop-blur-xl"
                >
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-fixed/55 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="mt-8 inline-flex w-fit rounded-full bg-primary-fixed/35 px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-primary uppercase">
                      {feature.metric}
                    </div>
                    <h3 className="mt-5 text-2xl font-black tracking-tight text-on-surface">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-on-surface-variant md:text-base">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card
            data-reveal
            className="relative overflow-hidden border-0 bg-[#08271c] py-0 text-white shadow-[0_44px_110px_-50px_rgba(4,24,17,0.82)]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(111,251,190,0.18),transparent_38%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,0.03),rgba(255,255,255,0)_38%)]" />
            <CardContent className="relative p-6 md:p-8">
              <div className="flex items-start justify-between gap-6">
                <div className="max-w-md">
                  <Badge className="bg-white/8 px-3 py-1 text-[11px] font-bold tracking-[0.24em] uppercase text-primary-fixed">
                    {t("controlTowerEyebrow")}
                  </Badge>
                  <h3 className="mt-5 text-3xl font-black tracking-tight md:text-4xl">
                    {t("spotlightTitle")}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-white/74 md:text-base">
                    {t("spotlightDescription")}
                  </p>
                </div>
                <div className="hidden rounded-2xl border border-white/10 bg-white/5 p-4 xl:block">
                  <TimerReset className="h-8 w-8 text-primary-fixed" />
                </div>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {dashboardStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[1.5rem] border border-white/10 bg-white/7 p-5"
                  >
                    <div className="text-3xl font-black tracking-tight text-primary-fixed">
                      {stat.value}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/68">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#10392b] p-5 shadow-inner shadow-black/20">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <p className="text-sm font-bold text-white">{t("boardTitle")}</p>
                    <p className="text-xs tracking-[0.22em] text-white/45 uppercase">
                      {t("boardSubtitle")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary-fixed" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/16" />
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  {boardMetrics.map((row) => (
                    <div key={row.label} className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-white/72">
                        <span>{row.label}</span>
                        <span className="font-bold text-white">{row.value}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/8">
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,#6ffbbe,#0ea86f)]"
                          style={{ width: row.fill }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
