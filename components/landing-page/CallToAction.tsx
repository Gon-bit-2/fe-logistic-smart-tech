"use client";

/**
 * CallToAction component
 * Full image background section with parallax scroll effect via GSAP.
 * Button sử dụng Shadcn Button, text fade-in khi cuộn tới.
 */
import React, { useRef } from "react";
import { ctaData } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface CallToActionProps {}

export default function CallToAction({}: Readonly<CallToActionProps>) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Hiệu ứng parallax cho ảnh nền — dịch chuyển ngược chiều cuộn trang
      gsap.to(".cta-bg-img", {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Text content fade-in và scale-up nhẹ
      gsap.from(".cta-content", {
        y: 50,
        opacity: 0,
        scale: 0.95,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="px-8 pb-32">
      <div className="max-w-7xl mx-auto relative h-[600px] flex items-center justify-center rounded-3xl overflow-hidden group">
        <img
          alt="Modern green logistics hub"
          className="cta-bg-img absolute inset-0 w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-1000"
          src={ctaData.bgImage}
        />
        <div className="absolute inset-0 bg-emerald-950/40"></div>
        <div className="cta-content relative z-10 text-center px-6 max-w-3xl space-y-10">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white">
            {ctaData.title}
          </h2>
          <p className="text-xl text-white/90">{ctaData.description}</p>
          <div className="pt-6">
            <Button
              size="lg"
              className="px-12 py-7 bg-primary-fixed text-on-primary-fixed rounded-lg font-black text-lg uppercase tracking-widest hover:bg-primary-fixed hover:brightness-110 transition-all active:scale-95 shadow-2xl"
            >
              {ctaData.buttonText}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
