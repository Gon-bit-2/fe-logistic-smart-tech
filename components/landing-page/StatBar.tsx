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

export interface StatBarProps {}

export default function StatBar({}: Readonly<StatBarProps>) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Fade-in cho tiêu đề
      gsap.from(".stat-title", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      // Stagger cho mỗi stat item
      gsap.from(".stat-item", {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".stat-grid",
          start: "top 85%",
        },
      });

      // Hiệu ứng đếm số cho mỗi con số thống kê
      document.querySelectorAll<HTMLElement>(".stat-value").forEach((el) => {
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
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-emerald-950 py-20 px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="stat-title text-center text-primary-fixed text-2xl md:text-4xl font-bold mb-16 tracking-tight">
          Sustainability Solutions For Every Stage Of Your Journey
        </h2>
        <div className="stat-grid grid grid-cols-2 md:grid-cols-4 gap-8">
          {statData.map((stat, index) => (
            <div key={index} className="stat-item text-center space-y-2">
              <div className="text-white/60 text-xs font-bold uppercase tracking-widest">
                {stat.label}
              </div>
              <div
                className="stat-value text-4xl md:text-5xl font-black text-white"
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
