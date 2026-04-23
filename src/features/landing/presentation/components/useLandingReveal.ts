"use client";

import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type RevealOptions = {
  selector?: string;
  start?: string;
  stagger?: number;
  x?: number;
  y?: number;
};

export function useLandingReveal(
  scopeRef: RefObject<HTMLElement | null>,
  {
    selector = "[data-reveal]",
    start = "top 75%",
    stagger = 0.12,
    x = 0,
    y = 36,
  }: RevealOptions = {},
) {
  useGSAP(
    () => {
      if (!scopeRef.current) {
        return;
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const targets = gsap.utils.toArray<HTMLElement>(selector, scopeRef.current);

      if (!targets.length) {
        return;
      }

      gsap.from(targets, {
        duration: 0.9,
        ease: "power3.out",
        opacity: 0,
        stagger,
        x,
        y,
        scrollTrigger: {
          trigger: scopeRef.current,
          once: true,
          start,
        },
      });
    },
    { scope: scopeRef },
  );
}
