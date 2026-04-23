"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ctaData } from "@/i18n/vi";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function CallToAction() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      gsap.from("[data-cta-reveal]", {
        duration: 0.95,
        ease: "power3.out",
        opacity: 0,
        stagger: 0.14,
        y: 40,
        scrollTrigger: {
          trigger: sectionRef.current,
          once: true,
          start: "top 72%",
        },
      });

      if (gridRef.current) {
        gsap.to(gridRef.current, {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      if (panelRef.current) {
        gsap.fromTo(
          panelRef.current,
          {
            rotateX: 8,
            scale: 0.96,
            y: 24,
          },
          {
            duration: 1.1,
            ease: "power3.out",
            rotateX: 0,
            scale: 1,
            y: 0,
            scrollTrigger: {
              trigger: sectionRef.current,
              once: true,
              start: "top 74%",
            },
          },
        );
      }
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="px-6 pb-32 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="relative isolate overflow-hidden rounded-[2.4rem] bg-[#041711] px-6 py-8 shadow-[0_55px_130px_-58px_rgba(3,20,15,0.86)] md:px-10 md:py-10">
          <div
            ref={gridRef}
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundPosition: "center",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(111,251,190,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(5,173,112,0.24),transparent_28%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(4,23,17,0.84),rgba(6,40,29,0.92)_60%,rgba(4,27,20,0.88))]" />

          <div className="relative grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="flex flex-col justify-between gap-8">
              <div data-cta-reveal className="max-w-xl space-y-5">
                <Badge className="bg-white/8 px-3 py-1 text-[11px] font-bold tracking-[0.26em] uppercase text-primary-fixed">
                  {ctaData.eyebrow}
                </Badge>
                <h2 className="text-4xl font-black tracking-tight text-white md:text-6xl">
                  {ctaData.title}
                </h2>
                <p className="text-lg leading-8 text-white/74">
                  {ctaData.description}
                </p>
              </div>

              <div className="grid gap-3" data-cta-reveal>
                {ctaData.supportPoints.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-[1.35rem] border border-white/10 bg-white/6 px-4 py-3 text-white/84 backdrop-blur-sm"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-fixed" />
                    <p className="text-sm leading-7">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div
              ref={panelRef}
              className="[perspective:1600px]"
            >
              <Card
                data-cta-reveal
                className="relative overflow-hidden border border-white/12 bg-white/8 py-0 text-white shadow-[0_30px_120px_-48px_rgba(0,0,0,0.78)] backdrop-blur-xl"
              >
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02)_32%,transparent)]" />
                <CardContent className="relative p-6 md:p-8">
                  <div className="grid gap-4 sm:grid-cols-3">
                    {ctaData.trustStats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-[1.4rem] border border-white/10 bg-[#0d2c21] px-4 py-4"
                      >
                        <div className="text-3xl font-black tracking-tight text-primary-fixed">
                          {stat.value}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-white/68">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 rounded-[1.8rem] border border-white/12 bg-[#0d2f23]/92 p-6">
                    <p className="text-xs font-black tracking-[0.28em] text-primary-fixed uppercase">
                      Launch with Emerald
                    </p>
                    <h3 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
                      Vận hành xanh, nhìn rõ dữ liệu, mở rộng nhanh hơn.
                    </h3>
                    <p className="mt-4 max-w-2xl text-base leading-8 text-white/74">
                      Một nền tảng cho điều phối, minh bạch phát thải và tối ưu chi phí thay vì chắp vá nhiều công cụ rời rạc.
                    </p>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                      <Button
                        asChild
                        size="lg"
                        className="h-13 rounded-xl bg-primary-fixed px-7 text-sm font-black tracking-[0.22em] text-on-primary-fixed uppercase hover:bg-primary-fixed hover:brightness-110"
                      >
                        <Link href="/dashboard">
                          {ctaData.buttonText}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>

                      <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="h-13 rounded-xl border-white/15 bg-white/6 px-7 text-sm font-black tracking-[0.22em] text-white uppercase hover:bg-white/12"
                      >
                        <Link href="#features">
                          <Play className="h-4 w-4 fill-current" />
                          {ctaData.secondaryButtonText}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
