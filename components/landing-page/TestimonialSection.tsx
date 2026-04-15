"use client";

/**
 * TestimonialSection component
 * Hiển thị nhận xét từ khách hàng với hiệu ứng fade-in ScrollTrigger.
 * Các ngôi sao xuất hiện stagger, trích dẫn trượt lên, avatar scale-in.
 * Dùng div thường thay vì Card vì section này cần layout transparent & custom.
 */
import React, { useRef } from "react";
import { testimonialData } from "@/lib/mockData";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function TestimonialSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Stagger fade-in cho 5 ngôi sao
      gsap.from(".star-icon", {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: "back.out(2)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      // Trích dẫn trượt lên
      gsap.from(".testimonial-quote", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".testimonial-quote",
          start: "top 85%",
        },
      });

      // Avatar và tên tác giả scale-in
      gsap.from(".testimonial-author", {
        y: 20,
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".testimonial-author",
          start: "top 90%",
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="py-32 px-8">
      <div className="max-w-4xl mx-auto text-center space-y-12">
        <div className="flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <span
              key={s}
              className="star-icon material-symbols-outlined text-primary"
              data-icon="star"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
          ))}
        </div>
        <blockquote className="testimonial-quote cursor-default text-3xl md:text-4xl font-medium italic leading-snug tracking-tight text-on-surface transition-all duration-500 hover:-translate-y-1 hover:text-primary">
          &ldquo;{testimonialData.quote}&rdquo;
        </blockquote>
        <div className="testimonial-author group flex flex-col items-center gap-4 transition-transform duration-300 hover:-translate-y-1">
          <div className="h-16 w-16 overflow-hidden rounded-full bg-surface-container ring-4 ring-primary-fixed transition-all duration-300 group-hover:scale-105 group-hover:ring-primary">
            <img
              alt={testimonialData.author}
              className="w-full h-full object-cover"
              src={testimonialData.avatar}
            />
          </div>
          <div>
            <div className="text-xl font-bold text-on-surface transition-colors duration-300 group-hover:text-primary">
              {testimonialData.author}
            </div>
            <div className="text-xs font-black uppercase tracking-widest text-on-surface-variant transition-colors duration-300 group-hover:text-on-surface">
              {testimonialData.role}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
