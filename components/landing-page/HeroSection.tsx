"use client";

/**
 * HeroSection component
 * The visually striking initial impression using background image with gradients.
 */
import React, { useRef } from 'react';
import { heroData } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export interface HeroSectionProps {}

export default function HeroSection({}: Readonly<HeroSectionProps>) {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(".hero-anim", {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
      delay: 0.2
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* High-quality realistic background image */}
      <img alt="Electric delivery fleet at charging station" className="absolute inset-0 w-full h-full object-cover" src={heroData.bgImage} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-emerald-950/90"></div>
      
      <div className="relative z-10 max-w-5xl mx-auto px-8 text-center pt-20">
        <h1 className="hero-anim text-5xl md:text-8xl font-extrabold tracking-tighter text-white leading-[1.1] mb-8">
          {heroData.titleLine1} <br/><span className="text-primary-fixed italic">{heroData.titleLine2}</span>
        </h1>
        
        <p className="hero-anim text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-12 font-medium">
          {heroData.description}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Button className="hero-anim w-full sm:w-auto px-10 py-7 bg-primary-fixed text-on-primary-fixed rounded-lg font-black text-sm uppercase tracking-widest shadow-xl hover:bg-primary-fixed hover:brightness-110 transition-all active:scale-95">
            Get Started
          </Button>
          <Button className="hero-anim w-full sm:w-auto px-10 py-7 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-lg font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined" data-icon="play_circle">play_circle</span>
            Watch Video
          </Button>
        </div>
        
        <div className="hero-anim mt-16 text-white/60 text-sm font-bold tracking-widest uppercase">
          Trusted Data For Resilient Supply Chains.
        </div>
      </div>
    </section>
  );
}
