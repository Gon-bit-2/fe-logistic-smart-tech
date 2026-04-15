"use client";

/**
 * SustainabilitySection component
 * Hiển thị dữ liệu carbon footprint với hiệu ứng GSAP.
 * Badge "LIVE DATA" dùng Shadcn Badge. Dùng div thay Card
 * vì layout custom cần kiểm soát padding/gap tuyệt đối.
 */
import React, { useRef } from "react";
import { sustainabilityData } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface SustainabilitySectionProps {}

export default function SustainabilitySection(
  {}: Readonly<SustainabilitySectionProps>
) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Text content trượt từ trái vào
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

      // Ảnh trượt từ phải vào
      gsap.from(".sustain-image", {
        x: 60,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      // Impact panel fade-in và trượt lên
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

      // Vòng tròn impact xoay nhẹ khi xuất hiện
      gsap.from(".impact-ring", {
        rotation: -90,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".impact-ring",
          start: "top 85%",
        },
      });

      // Counter animation cho giá trị carbon
      const valEl = document.querySelector<HTMLElement>(".carbon-value");
      if (valEl) {
        const raw = valEl.dataset.value || "0";
        const match = raw.match(/^([\d.]+)(.*)$/);
        if (match) {
          const endVal = parseFloat(match[1]);
          const suffix = match[2];
          const obj = { val: 0 };
          gsap.to(obj, {
            val: endVal,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: valEl,
              start: "top 90%",
            },
            onUpdate: () => {
              valEl.textContent =
                endVal % 1 !== 0
                  ? obj.val.toFixed(1) + suffix
                  : Math.round(obj.val) + suffix;
            },
          });
        }
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="py-32 px-8 bg-surface-container-low overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="sustain-text space-y-10 order-2 lg:order-1">
          <h2 className="text-4xl md:text-6xl font-black text-on-surface leading-tight tracking-tighter">
            {sustainabilityData.title}{" "}
            <span className="text-primary">
              {sustainabilityData.titleHighlight}
            </span>
          </h2>
          <p className="text-xl text-on-surface-variant leading-relaxed">
            {sustainabilityData.description}
          </p>

          {/* Impact panel — dùng div thường thay vì Shadcn Card */}
          <div className="impact-card bg-surface-container-lowest p-8 rounded-xl shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)] space-y-6">
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
            <p className="text-sm text-center text-on-surface-variant font-medium italic">
              {sustainabilityData.impactData.equivalent}
            </p>
          </div>
        </div>

        <div className="sustain-image order-1 lg:order-2">
          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/20 rounded-2xl blur-xl group-hover:bg-primary/30 transition-all"></div>
            <img
              alt="Lush green sustainable forest"
              className="relative rounded-2xl shadow-2xl aspect-square object-cover"
              src={sustainabilityData.image}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
