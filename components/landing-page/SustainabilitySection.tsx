"use client";

/**
 * SustainabilitySection component
 * Hiển thị dữ liệu carbon footprint với hiệu ứng GSAP.
 * Badge "LIVE DATA" dùng Shadcn Badge. Dùng div thay Card
 * vì layout custom cần kiểm soát padding/gap tuyệt đối.
 */
import React, { useRef } from "react";
import dynamic from "next/dynamic";
import { sustainabilityData } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type SustainabilitySceneState = {
  val: number;
  carbonLevel: number;
};

const SustainabilityParticleScene = dynamic(
  () => import("./three/SustainabilityParticleScene"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(111,251,190,0.22),transparent_60%)]" />
    ),
  },
);

export default function SustainabilitySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const sceneStateRef = useRef<SustainabilitySceneState>({
    val: 0,
    carbonLevel: 0,
  });

  useGSAP(
    () => {
      sceneStateRef.current.val = 0;
      sceneStateRef.current.carbonLevel = 0;

      gsap.from(".sustain-text", {
        x: -60,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      gsap.from(".sustain-canvas-container", {
        x: 60,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      gsap.from(".impact-card", {
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".impact-card",
          start: "top 85%",
        },
      });

      gsap.from(".impact-ring", {
        rotation: -90,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".impact-card",
          start: "top 85%",
        },
      });

      const valEl = sectionRef.current?.querySelector<HTMLElement>(".carbon-value");
      if (valEl) {
        const raw = valEl.dataset.value || "0";
        const match = raw.match(/^([\d.]+)(.*)$/);
        if (match) {
          const endVal = parseFloat(match[1]);
          const suffix = match[2];
          if (endVal > 0) {
            gsap.to(sceneStateRef.current, {
              val: endVal,
              duration: 3,
              ease: "power2.inOut",
              scrollTrigger: {
                trigger: valEl,
                start: "top 85%",
              },
              onUpdate: () => {
                valEl.textContent =
                  endVal % 1 !== 0
                    ? sceneStateRef.current.val.toFixed(1) + suffix
                    : Math.round(sceneStateRef.current.val) + suffix;
                sceneStateRef.current.carbonLevel =
                  sceneStateRef.current.val / endVal;
              },
              onComplete: () => {
                sceneStateRef.current.carbonLevel = 1;
              },
            });
          }
        }
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="py-32 px-8 bg-surface-container-low overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="sustain-text space-y-10 order-2 lg:order-1 relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-on-surface leading-tight tracking-tighter">
            {sustainabilityData.title}{" "}
            <span className="text-primary">
              {sustainabilityData.titleHighlight}
            </span>
          </h2>
          <p className="text-xl text-on-surface-variant leading-relaxed">
            {sustainabilityData.description}
          </p>

          <div className="impact-card bg-surface-container-lowest p-8 rounded-xl shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)] space-y-6 hover:scale-105 hover:shadow-[0_40px_80px_-20px_rgba(0,108,73,0.15)] cursor-default transition-all duration-500 will-change-transform relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-center">
                <span className="font-bold text-on-surface text-lg">
                  Real-time Global Impact
                </span>
                <Badge
                  variant="secondary"
                  className="bg-secondary-container text-on-secondary-container font-black text-xs"
                >
                  LIVE DATA
                </Badge>
              </div>

              <div className="relative py-12 flex justify-center">
                <div className="w-48 h-48 rounded-full border-[12px] border-surface-container flex items-center justify-center relative">
                  <div className="impact-ring absolute inset-0 rounded-full border-[12px] border-primary border-t-transparent border-r-transparent -rotate-45"></div>
                  <div className="text-center">
                    <div
                      className="carbon-value text-4xl font-black text-on-surface"
                      data-value={sustainabilityData.impactData.value}
                    >
                      0
                    </div>
                    <div className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                      {sustainabilityData.impactData.label}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-center text-on-surface-variant font-medium italic">
              {sustainabilityData.impactData.equivalent}
            </p>
          </div>
        </div>

        <div className="sustain-canvas-container relative order-1 mx-auto aspect-square w-full max-w-[600px] rounded-full lg:order-2">
          <div className="absolute inset-4 rounded-full bg-surface-container blur-3xl opacity-50" />
          <div className="absolute inset-10 rounded-full border border-primary/10" />
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(111,251,190,0.16),transparent_62%)]" />

          <div className="absolute inset-0 z-10 pointer-events-none">
            <SustainabilityParticleScene sceneStateRef={sceneStateRef} />
          </div>
        </div>
      </div>
    </section>
  );
}
