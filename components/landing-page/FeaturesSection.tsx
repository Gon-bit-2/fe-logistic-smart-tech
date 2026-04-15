"use client";

/**
 * FeaturesSection component
 * Hiển thị các tính năng cốt lõi (AI Routing, Green Fleet).
 * GSAP ScrollTrigger stagger cho hiệu ứng xuất hiện khi cuộn tới.
 * Không dùng Shadcn Card ở đây vì layout custom phức tạp (col-span, flex-1)
 * xung đột với cấu trúc Card mặc định (gap-4, py-4).
 */
import React, { useRef } from "react";
import { featuresData } from "@/lib/mockData";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface FeaturesSectionProps {}

export default function FeaturesSection({}: Readonly<FeaturesSectionProps>) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Fade-in cho header section
      gsap.from(".features-header", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      // Stagger cho các feature card — trượt từ dưới lên
      gsap.from(".feature-card", {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.25,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".features-grid",
          start: "top 80%",
        },
      });

      // Zoom-out nhẹ cho ảnh bên trong card khi card xuất hiện
      gsap.from(".feature-img", {
        scale: 1.15,
        duration: 1.2,
        stagger: 0.25,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".features-grid",
          start: "top 80%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-32 px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="features-header text-center mb-20 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-on-surface">
            {featuresData.title}{" "}
            <span className="text-primary">{featuresData.titleHighlight}</span>
          </h2>
          <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">
            {featuresData.description}
          </p>
        </div>

        <div className="features-grid grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Smart Routing */}
          <div className="feature-card md:col-span-7 bg-surface-container-lowest overflow-hidden rounded-xl flex flex-col group hover:shadow-2xl transition-all duration-500">
            <div className="h-64 overflow-hidden">
              <img
                alt="Traffic management center"
                className="feature-img w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                src={featuresData.features[0].image}
              />
            </div>
            <div className="p-10 flex flex-col justify-between flex-1">
              <div className="space-y-4">
                <h3 className="text-3xl font-bold tracking-tight text-on-surface">
                  {featuresData.features[0].title}
                </h3>
                <p className="text-on-surface-variant leading-relaxed text-lg max-w-md">
                  {featuresData.features[0].description}
                </p>
              </div>
              <div className="mt-8 flex items-center text-primary font-bold group-hover:gap-4 transition-all gap-2 cursor-pointer">
                Learn more{" "}
                <span
                  className="material-symbols-outlined"
                  data-icon="arrow_forward"
                >
                  arrow_forward
                </span>
              </div>
            </div>
          </div>

          {/* Green Fleet */}
          <div className="feature-card md:col-span-5 bg-primary text-on-primary overflow-hidden rounded-xl flex flex-col shadow-xl shadow-primary/20">
            <div className="h-64 overflow-hidden">
              <img
                alt="Modern electric van on the road"
                className="feature-img w-full h-full object-cover opacity-80"
                src={featuresData.features[1].image}
              />
            </div>
            <div className="p-10 flex flex-col justify-between flex-1">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold tracking-tight">
                  {featuresData.features[1].title}
                </h3>
                <p className="text-primary-fixed-dim/80 leading-relaxed">
                  {featuresData.features[1].description}
                </p>
              </div>
              <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                <div className="flex -space-x-3">
                  {featuresData.features[1].imagesFeedback?.map((img, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-primary bg-surface-variant overflow-hidden"
                    >
                      <img
                        alt="Feedback user"
                        className="w-full h-full object-cover"
                        src={img}
                      />
                    </div>
                  ))}
                </div>
                <span className="text-sm font-medium">98% Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
