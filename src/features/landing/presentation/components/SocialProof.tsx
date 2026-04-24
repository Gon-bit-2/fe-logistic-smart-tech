"use client";

import React, { useRef } from "react";
import { ArrowUpRight, Building2, Handshake, Orbit, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLandingReveal } from "@/features/landing/presentation/components/useLandingReveal";

const icons = [Orbit, Building2, ShieldCheck];

type SocialStat = {
  label: string;
  value: string;
};

type SocialHighlight = {
  description: string;
  title: string;
};

export default function SocialProof() {
  const t = useTranslations("landing.socialProof");
  const stats = t.raw("stats") as SocialStat[];
  const partnerGroups = t.raw("partnerGroups") as string[];
  const highlights = t.raw("highlights") as SocialHighlight[];
  const sectionRef = useRef<HTMLElement>(null);

  useLandingReveal(sectionRef);

  return (
    <section
      id="solutions"
      ref={sectionRef}
      className="relative overflow-hidden bg-[linear-gradient(180deg,#eaf7ee_0%,#edf9f0_100%)] px-6 py-24 md:px-8"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-primary-fixed/20 blur-3xl" />

      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div
          data-reveal
          className="rounded-[2rem] border border-white/70 bg-white/70 p-8 shadow-[0_30px_80px_-42px_rgba(0,79,53,0.35)] backdrop-blur-xl md:p-10"
        >
          <Badge variant="outline" className="border-primary/15 bg-primary-fixed/40 px-3 py-1 text-[11px] font-bold tracking-[0.24em] uppercase text-primary">
            {t("eyebrow")}
          </Badge>

          <div className="mt-6 max-w-2xl space-y-4">
            <h2 className="text-3xl font-black tracking-tight text-on-surface md:text-5xl">
              {t("title")}
            </h2>
            <p className="text-base leading-8 text-on-surface-variant md:text-lg">
              {t("description")}
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {stats.map((stat, index) => {
              const Icon = icons[index] ?? Orbit;

              return (
                <Card
                  key={stat.label}
                  className="border-white/70 bg-white/80 py-0 shadow-[0_24px_60px_-44px_rgba(0,83,56,0.4)]"
                >
                  <CardContent className="flex h-full flex-col gap-4 p-5">
                    <div className="flex items-center justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-fixed/55 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-primary/70" />
                    </div>
                    <div className="text-3xl font-black tracking-tight text-on-surface">
                      {stat.value}
                    </div>
                    <p className="text-sm leading-6 text-on-surface-variant">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <Card
          data-reveal
          className="relative overflow-hidden border-0 bg-[#082219] py-0 text-white shadow-[0_38px_100px_-48px_rgba(2,32,22,0.8)]"
        >
          <div className="absolute inset-x-8 top-0 h-px bg-white/15" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(111,251,190,0.14),transparent_48%)]" />
          <CardContent className="relative flex h-full flex-col justify-between p-8">
            <div>
              <div className="flex items-center gap-3 text-primary-fixed">
                <Handshake className="h-5 w-5" />
                <span className="text-xs font-black tracking-[0.28em] uppercase text-primary-fixed/90">
                  {t("ecosystemEyebrow")}
                </span>
              </div>
              <p className="mt-5 max-w-sm text-sm leading-7 text-white/72">
                {t("ecosystemDescription")}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {partnerGroups.map((group) => (
                <Badge
                  key={group}
                  variant="outline"
                  className="rounded-full border-white/15 bg-white/6 px-4 py-2 text-sm font-medium text-white/82"
                >
                  {group}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mx-auto mt-8 grid max-w-7xl gap-6 lg:grid-cols-2">
        {highlights.map((item) => (
          <Card
            key={item.title}
            data-reveal
            className="border-white/70 bg-white/72 py-0 shadow-[0_30px_70px_-48px_rgba(0,83,56,0.45)] backdrop-blur-xl"
          >
            <CardContent className="flex gap-4 p-6 md:p-7">
              <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-fixed/45 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black tracking-tight text-on-surface">
                  {item.title}
                </h3>
                <p className="text-sm leading-7 text-on-surface-variant md:text-base">
                  {item.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
