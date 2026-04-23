"use client";

import type { ReactNode } from "react";
import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Compass, LifeBuoy, RefreshCcw } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ErrorExperienceAction, ErrorExperienceContent } from "@/lib/error-experience";

gsap.registerPlugin(useGSAP);

type ErrorExperienceProps = {
  content: ErrorExperienceContent;
  compact?: boolean;
  onPrimaryAction?: () => void;
};

const toneClasses = {
  amber: {
    accent: "text-amber-300",
    badge: "border-amber-200/20 bg-amber-300/10 text-amber-200",
    bg: "bg-[linear-gradient(180deg,#1d180c_0%,#221507_100%)]",
    card: "border-amber-200/10 bg-white/6 text-white",
    glow: "bg-amber-300/12",
    orb: "bg-amber-300/16",
    panel: "border-amber-200/12 bg-[#2b1d0c]/92 text-white",
    subtle: "text-white/72",
  },
  emerald: {
    accent: "text-primary-fixed",
    badge: "border-primary-fixed/20 bg-primary-fixed/10 text-primary-fixed",
    bg: "bg-[linear-gradient(180deg,#071c15_0%,#08261d_100%)]",
    card: "border-primary-fixed/12 bg-white/6 text-white",
    glow: "bg-primary-fixed/10",
    orb: "bg-primary-fixed/18",
    panel: "border-primary-fixed/12 bg-[#0c2f24]/92 text-white",
    subtle: "text-white/72",
  },
  rose: {
    accent: "text-rose-200",
    badge: "border-rose-200/20 bg-rose-300/10 text-rose-200",
    bg: "bg-[linear-gradient(180deg,#1a0d12_0%,#210f17_100%)]",
    card: "border-rose-200/10 bg-white/6 text-white",
    glow: "bg-rose-300/10",
    orb: "bg-rose-300/16",
    panel: "border-rose-200/10 bg-[#2a121b]/92 text-white",
    subtle: "text-white/72",
  },
  sky: {
    accent: "text-cyan-200",
    badge: "border-cyan-200/20 bg-cyan-300/10 text-cyan-200",
    bg: "bg-[linear-gradient(180deg,#08141f_0%,#091b2a_100%)]",
    card: "border-cyan-200/10 bg-white/6 text-white",
    glow: "bg-cyan-300/10",
    orb: "bg-cyan-300/18",
    panel: "border-cyan-200/10 bg-[#0d2438]/92 text-white",
    subtle: "text-white/72",
  },
} as const;

function renderAction(
  action: ErrorExperienceAction,
  onClick?: () => void,
  extraIcon?: ReactNode,
) {
  const icon = extraIcon ?? <ArrowRight className="h-4 w-4" />;

  if (action.href) {
    return (
      <Button asChild size="lg" variant={action.variant ?? "default"} className="h-12 rounded-xl px-5 font-bold">
        <Link href={action.href}>
          {action.label}
          {icon}
        </Link>
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      variant={action.variant ?? "default"}
      className="h-12 rounded-xl px-5 font-bold"
      onClick={onClick}
    >
      {action.label}
      {icon}
    </Button>
  );
}

export default function ErrorExperience({
  content,
  compact = false,
  onPrimaryAction,
}: Readonly<ErrorExperienceProps>) {
  const sectionRef = useRef<HTMLElement>(null);
  const tone = toneClasses[content.tone];

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      gsap.from("[data-error-reveal]", {
        duration: 0.95,
        ease: "power3.out",
        opacity: 0,
        rotateX: -10,
        stagger: 0.12,
        y: 36,
      });

      gsap.to("[data-error-float]", {
        duration: 7,
        ease: "sine.inOut",
        repeat: -1,
        stagger: 0.6,
        y: -18,
        yoyo: true,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative isolate overflow-hidden px-6 py-10 md:px-8",
        compact ? "min-h-[78vh]" : "min-h-[100dvh]",
        tone.bg,
      )}
    >
      <div
        data-error-float
        className={cn("pointer-events-none absolute left-[-6%] top-[10%] h-72 w-72 rounded-full blur-3xl", tone.orb)}
      />
      <div
        data-error-float
        className={cn("pointer-events-none absolute bottom-[8%] right-[-4%] h-96 w-96 rounded-full blur-3xl", tone.glow)}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_32%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="pointer-events-none absolute right-0 top-0 hidden select-none text-[10rem] font-black tracking-[-0.08em] text-white/5 lg:block xl:text-[14rem]">
          {content.code}
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="max-w-2xl space-y-6">
            <div data-error-reveal className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-semibold text-white/82 backdrop-blur-md">
              <span className={cn("flex h-9 w-9 items-center justify-center rounded-full bg-white/8", tone.accent)}>
                <Compass className="h-4 w-4" />
              </span>
              Emerald Logistics
            </div>

            <div data-error-reveal>
              <Badge variant="outline" className={cn("px-3 py-1 text-[11px] font-black tracking-[0.24em] uppercase", tone.badge)}>
                {content.eyebrow}
              </Badge>
            </div>

            <div data-error-reveal className={cn("text-6xl font-black tracking-[-0.08em] md:text-8xl", tone.accent)}>
              {content.code}
            </div>

            <div data-error-reveal className="space-y-4">
              <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
                {content.title}
              </h1>
              <p className={cn("max-w-2xl text-lg leading-8", tone.subtle)}>
                {content.description}
              </p>
            </div>

            <div data-error-reveal className="flex flex-col gap-4 sm:flex-row">
              {renderAction(content.primaryAction, onPrimaryAction, <RefreshCcw className="h-4 w-4" />)}
              {content.secondaryAction ? renderAction(content.secondaryAction, undefined, <ArrowRight className="h-4 w-4" />) : null}
            </div>

            <div data-error-reveal className="flex flex-wrap gap-3">
              {content.links.map((item) => (
                <Button
                  key={`${item.label}-${item.href}`}
                  asChild
                  size="sm"
                  variant={item.variant ?? "ghost"}
                  className="rounded-full border border-white/10 bg-white/5 px-4 text-white hover:bg-white/10"
                >
                  <Link href={item.href ?? "/"}>
                    {item.label}
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            <Card data-error-reveal className={cn("overflow-hidden py-0 shadow-[0_34px_120px_-54px_rgba(0,0,0,0.65)] backdrop-blur-xl", tone.card)}>
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-3">
                  <span className={cn("flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8", tone.accent)}>
                    <LifeBuoy className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-white/52">
                      Error diagnostics
                    </p>
                    <p className="text-base font-semibold text-white">Tình trạng hiện tại và các dấu hiệu chính</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {content.insights.map((item) => (
                    <div key={item.label} className={cn("rounded-[1.35rem] border p-4", tone.panel)}>
                      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/45">
                        {item.label}
                      </p>
                      <p className="mt-3 text-base leading-7 text-white/88">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card data-error-reveal className={cn("py-0 shadow-[0_28px_80px_-56px_rgba(0,0,0,0.62)] backdrop-blur-xl", tone.card)}>
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-white/52">
                      Recommended next steps
                    </p>
                    <p className="mt-2 text-xl font-black tracking-tight text-white">
                      Cách xử lý nhanh để tiếp tục thao tác
                    </p>
                  </div>
                  <div className={cn("hidden rounded-full px-4 py-2 text-sm font-bold md:block", tone.badge)}>
                    Stable fallback
                  </div>
                </div>

                <div className="mt-6 grid gap-3">
                  {content.checklist.map((item, index) => (
                    <div
                      key={item}
                      className="flex gap-4 rounded-[1.2rem] border border-white/8 bg-white/5 px-4 py-4"
                    >
                      <div className={cn("text-sm font-black", tone.accent)}>
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <p className="text-sm leading-7 text-white/82">{item}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
