"use client";

import React, { useRef } from "react";
import { Quote, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { testimonialSectionCopy } from "@/i18n/vi";
import { useLandingReveal } from "@/features/landing/presentation/components/useLandingReveal";

export default function TestimonialSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLandingReveal(sectionRef);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden bg-[linear-gradient(180deg,#effbf4_0%,#eaf7ee_100%)] px-6 py-28 md:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr]">
          <div data-reveal className="space-y-5">
            <Badge variant="outline" className="border-primary/15 bg-white/70 px-3 py-1 text-[11px] font-bold tracking-[0.24em] uppercase text-primary">
              {testimonialSectionCopy.eyebrow}
            </Badge>
            <h2 className="max-w-xl text-4xl font-black tracking-tight text-on-surface md:text-6xl">
              {testimonialSectionCopy.title}
            </h2>
            <p className="max-w-xl text-lg leading-8 text-on-surface-variant">
              {testimonialSectionCopy.description}
            </p>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {testimonialSectionCopy.metrics.map((metric) => (
                <Card
                  key={metric.label}
                  className="border-white/75 bg-white/75 py-0 shadow-[0_28px_70px_-50px_rgba(0,84,58,0.38)]"
                >
                  <CardContent className="p-5">
                    <div className="text-3xl font-black tracking-tight text-primary">
                      {metric.value}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                      {metric.label}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {testimonialSectionCopy.testimonials.map((item) => (
              <Card
                key={`${item.name}-${item.company}`}
                data-reveal
                className="border-white/75 bg-white/80 py-0 shadow-[0_34px_80px_-52px_rgba(0,84,58,0.42)]"
              >
                <CardContent className="flex h-full flex-col p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={`${item.company}-${index}`}
                          className="h-4 w-4 fill-current"
                        />
                      ))}
                    </div>
                    <Quote className="h-5 w-5 text-primary/65" />
                  </div>

                  <p className="mt-6 flex-1 text-base leading-8 text-on-surface">
                    "{item.quote}"
                  </p>

                  <div className="mt-8 rounded-[1.4rem] bg-surface-container-low p-4">
                    <p className="text-xs font-black tracking-[0.22em] text-primary uppercase">
                      Tác động ghi nhận
                    </p>
                    <p className="mt-2 text-sm leading-7 text-on-surface">
                      {item.result}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-border/60 pt-5">
                    <div className="text-lg font-black tracking-tight text-on-surface">
                      {item.name}
                    </div>
                    <p className="text-sm text-on-surface-variant">
                      {item.role} · {item.company}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
