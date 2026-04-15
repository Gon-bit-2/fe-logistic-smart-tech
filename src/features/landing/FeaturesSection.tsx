"use client";

/**
 * FeaturesSection component
 * Tích hợp hiệu ứng 3D tilt với chiều sâu thật cho từng lớp nội dung.
 */
import React, { useRef } from "react";
import { featuresData } from "@/features/landing/data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const cardSurfaceStyle: React.CSSProperties = {
    ["--pointer-x" as string]: "50%",
    ["--pointer-y" as string]: "50%",
    transformStyle: "preserve-3d",
  };
  const mediaDepthStyle: React.CSSProperties = {
    transform: "translateZ(24px)",
  };
  const contentDepthStyle: React.CSSProperties = {
    transform: "translateZ(56px)",
    transformStyle: "preserve-3d",
  };
  const feedbackDepthStyle: React.CSSProperties = {
    transform: "translateZ(44px)",
  };

  useGSAP(
    () => {
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

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    ref: React.RefObject<HTMLDivElement | null>,
  ) => {
    if (!ref.current) return;

    const card = ref.current;
    const rect = card.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width;
    const yRatio = (e.clientY - rect.top) / rect.height;
    const media = card.querySelector<HTMLElement>("[data-depth='media']");
    const content = card.querySelector<HTMLElement>("[data-depth='content']");
    const feedback = card.querySelector<HTMLElement>("[data-depth='feedback']");

    card.style.setProperty("--pointer-x", `${xRatio * 100}%`);
    card.style.setProperty("--pointer-y", `${yRatio * 100}%`);

    const rotateX = (0.5 - yRatio) * 12;
    const rotateY = (xRatio - 0.5) * 14;

    gsap.to(card, {
      rotationX: rotateX,
      rotationY: rotateY,
      transformPerspective: 1600,
      transformOrigin: "center center",
      ease: "power2.out",
      duration: 0.28,
      overwrite: true,
    });

    if (media) {
      gsap.to(media, {
        x: (xRatio - 0.5) * -18,
        y: (yRatio - 0.5) * -14,
        ease: "power2.out",
        duration: 0.34,
        overwrite: true,
      });
    }

    if (content) {
      gsap.to(content, {
        x: (xRatio - 0.5) * 16,
        y: (yRatio - 0.5) * 12,
        ease: "power2.out",
        duration: 0.34,
        overwrite: true,
      });
    }

    if (feedback) {
      gsap.to(feedback, {
        x: (xRatio - 0.5) * 18,
        y: (yRatio - 0.5) * 10,
        ease: "power2.out",
        duration: 0.34,
        overwrite: true,
      });
    }
  };

  const handleMouseLeave = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return;

    const card = ref.current;
    const media = card.querySelector<HTMLElement>("[data-depth='media']");
    const content = card.querySelector<HTMLElement>("[data-depth='content']");
    const feedback = card.querySelector<HTMLElement>("[data-depth='feedback']");

    card.style.setProperty("--pointer-x", "50%");
    card.style.setProperty("--pointer-y", "50%");

    gsap.to(card, {
      rotationX: 0,
      rotationY: 0,
      ease: "power3.out",
      duration: 0.75,
      overwrite: true,
    });

    if (media) {
      gsap.to(media, {
        x: 0,
        y: 0,
        ease: "power3.out",
        duration: 0.55,
        overwrite: true,
      });
    }

    if (content) {
      gsap.to(content, {
        x: 0,
        y: 0,
        ease: "power3.out",
        duration: 0.55,
        overwrite: true,
      });
    }

    if (feedback) {
      gsap.to(feedback, {
        x: 0,
        y: 0,
        ease: "power3.out",
        duration: 0.55,
        overwrite: true,
      });
    }
  };

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
          <div 
            ref={card1Ref}
            onMouseMove={(e) => handleMouseMove(e, card1Ref)}
            onMouseLeave={() => handleMouseLeave(card1Ref)}
            style={cardSurfaceStyle}
            className="feature-card group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-primary/10 bg-surface-container-lowest transition-[transform,box-shadow] duration-500 will-change-transform hover:-translate-y-2 hover:shadow-[0_40px_90px_-24px_rgba(0,108,73,0.18)] md:col-span-7"
          >
            <div
              className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(circle at var(--pointer-x) var(--pointer-y), rgba(111, 251, 190, 0.26), transparent 34%)",
              }}
            />
            <div className="pointer-events-none absolute inset-[1px] rounded-[calc(1.75rem-1px)] border border-white/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="h-64 overflow-hidden" data-depth="media" style={mediaDepthStyle}>
              <img
                alt="Traffic management center"
                className="feature-img w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                src={featuresData.features[0].image}
              />
            </div>

            <div
              data-depth="content"
              style={contentDepthStyle}
              className="relative z-20 flex flex-1 flex-col justify-between bg-surface-container-lowest p-10"
            >
              <div className="space-y-4">
                <h3 className="text-3xl font-bold tracking-tight text-on-surface transition-colors duration-300 group-hover:text-primary">
                  {featuresData.features[0].title}
                </h3>
                <p className="max-w-md text-lg leading-relaxed text-on-surface-variant transition-colors duration-300 group-hover:text-on-surface">
                  {featuresData.features[0].description}
                </p>
              </div>
              <div className="mt-8 flex cursor-pointer items-center gap-2 font-bold text-primary transition-all duration-300 group-hover:gap-4 group-hover:tracking-wide">
                Learn more{" "}
                <span className="material-symbols-outlined" data-icon="arrow_forward">
                  arrow_forward
                </span>
              </div>
            </div>
          </div>

          {/* Green Fleet Analytics */}
          <div 
            ref={card2Ref}
            onMouseMove={(e) => handleMouseMove(e, card2Ref)}
            onMouseLeave={() => handleMouseLeave(card2Ref)}
            style={cardSurfaceStyle}
            className="feature-card group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-primary/20 bg-primary text-on-primary transition-[transform,box-shadow] duration-500 will-change-transform hover:-translate-y-2 hover:shadow-[0_40px_90px_-24px_rgba(0,108,73,0.3)] md:col-span-5"
          >
            <div
              className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(circle at var(--pointer-x) var(--pointer-y), rgba(227, 255, 241, 0.22), transparent 34%)",
              }}
            />
            <div className="pointer-events-none absolute inset-[1px] rounded-[calc(1.75rem-1px)] border border-white/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div
              className="relative h-64 overflow-hidden"
              data-depth="media"
              style={mediaDepthStyle}
            >
              <img
                alt="Modern electric van on the road"
                className="feature-img h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                src={featuresData.features[1].image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-primary/5 transition-opacity duration-500 group-hover:opacity-60"></div>
            </div>

            <div
              data-depth="content"
              style={contentDepthStyle}
              className="relative z-20 flex flex-1 flex-col justify-between bg-primary p-10"
            >
              <div className="space-y-4">
                <h3 className="text-2xl font-bold tracking-tight text-white transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary-fixed">
                  {featuresData.features[1].title}
                </h3>
                <p className="leading-relaxed text-primary-fixed-dim/90 transition-colors duration-300 group-hover:text-white/90">
                  {featuresData.features[1].description}
                </p>
              </div>

              <div
                data-depth="feedback"
                style={feedbackDepthStyle}
                className="mt-8 flex items-center justify-between border-t border-white/10 pt-8"
              >
                <div className="flex -space-x-3">
                  {featuresData.features[1].imagesFeedback?.map((img, i) => (
                    <div
                      key={i}
                      className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary bg-surface-variant transition-transform duration-300 group-hover:-translate-y-1"
                    >
                      <img alt="Feedback user" className="w-full h-full object-cover" src={img} />
                    </div>
                  ))}
                </div>
                <span className="text-sm font-medium text-white transition-all duration-300 group-hover:tracking-wide group-hover:text-primary-fixed">
                  98% Satisfaction
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
