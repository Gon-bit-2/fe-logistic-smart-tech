/**
 * Footer component
 * Website Footer.
 */
import React from "react";
import { footerCopy } from "@/i18n/vi";

export default function Footer() {
  return (
    <footer className="bg-emerald-950 w-full py-16 px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="group flex items-center gap-2 text-xl font-black text-white uppercase tracking-tighter transition-transform duration-300 hover:scale-[1.01]">
            <span className="material-symbols-outlined text-primary-fixed transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" data-icon="eco">eco</span>
            {footerCopy.brand}
          </div>
          <div className="flex flex-wrap justify-center gap-8 font-medium text-sm uppercase tracking-widest text-white/60">
            {footerCopy.links.map((item) => (
              <a
                key={item.label}
                className="relative pb-1 transition-all duration-300 hover:text-primary-fixed after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-primary-fixed after:transition-transform after:duration-300 hover:after:scale-x-100"
                href={item.href}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-4">
          <div className="text-white/40 text-sm tracking-widest uppercase">
            {footerCopy.copyright}
          </div>
          <div className="flex gap-6">
            <a className="text-white/40 transition-all duration-300 hover:-translate-y-0.5 hover:text-white" href="#"><span className="material-symbols-outlined" data-icon="public">public</span></a>
            <a className="text-white/40 transition-all duration-300 hover:-translate-y-0.5 hover:text-white" href="#"><span className="material-symbols-outlined" data-icon="share">share</span></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
