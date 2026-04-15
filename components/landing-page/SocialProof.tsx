"use client";

/**
 * SocialProof component
 * Hiển thị logo đối tác với hiệu ứng fade-in ScrollTrigger.
 * Khi cuộn tới, khu vực chuyển từ mờ sang rõ và các tên chạy stagger.
 */
import React, { useRef } from "react";
import { socialProofData } from "@/lib/mockData";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface SocialProofProps {}

export default function SocialProof({}: Readonly<SocialProofProps>) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Fade-in toàn bộ section
      gsap.from(sectionRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 90%",
        },
      });

      // Stagger mỗi tên partner trượt lên
      gsap.from(".social-name", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".social-row",
          start: "top 90%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-surface-container-low py-12 px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
        <span className="text-sm font-bold tracking-[0.2em] text-on-surface-variant uppercase">
          Trusted by Industry Leaders
        </span>
        <div className="social-row flex flex-wrap justify-center gap-12 text-on-surface-variant font-black text-2xl tracking-tighter">
          {socialProofData.map((client, index) => (
            <span key={index} className="social-name">
              {client}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
