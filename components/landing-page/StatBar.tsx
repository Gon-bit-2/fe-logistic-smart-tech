"use client";

/**
 * StatBar component
 * Hiển thị thống kê nổi bật với hiệu ứng đếm số GSAP ScrollTrigger.
 * Khi người dùng cuộn tới, mỗi con số sẽ nhảy từ 0 đến giá trị thực.
 */
import React, { useRef } from "react";
import { statData } from "@/lib/mockData";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function StatBar() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Hiệu ứng đếm số cho mỗi con số thống kê
      sectionRef.current?.querySelectorAll<HTMLElement>(".stat-value").forEach((el) => {
        const raw = el.dataset.value || "0";
        // Tách phần số và phần suffix (ví dụ: "1.2M+" -> numericPart=1.2, suffix="M+")
        const match = raw.match(/^([\d.]+)(.*)$/);
        if (!match) return;
        const endVal = parseFloat(match[1]);
        const suffix = match[2];
        const obj = { val: 0 };

        gsap.to(obj, {
          val: endVal,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            once: true,
          },
          onUpdate: () => {
            // Giữ định dạng thập phân nếu giá trị gốc có dấu chấm
            el.textContent =
              endVal % 1 !== 0
                ? obj.val.toFixed(1) + suffix
                : Math.round(obj.val) + suffix;
          },
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="bg-emerald-950 px-8 py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="stat-title mb-16 text-center text-2xl font-bold tracking-tight text-primary-fixed md:text-4xl">
          Sustainability Solutions For Every Stage Of Your Journey
        </h2>
        <div className="stat-grid grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {statData.map((stat, index) => (
            <div
              key={index}
              className="stat-item group flex h-full min-h-36 flex-col justify-between rounded-3xl border border-white/8 bg-white/[0.04] px-5 py-6 text-center shadow-[0_18px_40px_-32px_rgba(111,251,190,0.45)] transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.08]"
            >
              <div className="text-xs font-bold tracking-widest text-white/70 uppercase transition-colors duration-300 group-hover:text-primary-fixed/80">
                {stat.label}
              </div>
              <div
                className="stat-value text-4xl font-black leading-none text-white transition-all duration-300 group-hover:text-primary-fixed group-hover:[text-shadow:0_0_24px_rgba(111,251,190,0.25)] md:text-5xl"
                data-value={stat.value}
              >
                0
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
