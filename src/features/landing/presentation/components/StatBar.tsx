"use client";

import React, { useRef } from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLandingReveal } from "@/features/landing/presentation/components/useLandingReveal";

type StatItem = {
  label: string;
  value: string;
};

export default function StatBar() {
  const t = useTranslations("landing.statBar");
  const items = t.raw("items") as StatItem[];
  const sectionRef = useRef<HTMLElement>(null);

  useLandingReveal(sectionRef, { start: "top 82%", y: 28 });

  return (
    <section
      ref={sectionRef}
      className="relative bg-[linear-gradient(180deg,#06251a_0%,#0a3022_100%)] px-6 py-20 md:px-8"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(111,251,190,0.1),transparent_34%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div data-reveal className="max-w-xl space-y-4">
          <Badge className="bg-white/8 px-3 py-1 text-[11px] font-bold tracking-[0.24em] uppercase text-primary-fixed">
            {t("eyebrow")}
          </Badge>
          <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">
            {t("title")}
          </h2>
          <p className="text-base leading-8 text-white/72">
            {t("description")}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <Card
              key={item.label}
              data-reveal
              className="border-white/10 bg-white/[0.05] py-0 text-white backdrop-blur-xl"
            >
              <CardContent className="p-5">
                <div className="text-3xl font-black tracking-tight text-primary-fixed">
                  {item.value}
                </div>
                <p className="mt-2 text-sm leading-6 text-white/68">{item.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
