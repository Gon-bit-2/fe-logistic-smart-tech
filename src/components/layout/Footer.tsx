/**
 * Footer component
 * Website Footer.
 */
import React from "react";
import { useTranslations } from "next-intl";
import AppIcon from "@/components/ui/app-icon";
import type { FooterLink } from "@/types/components/layout.types";

export default function Footer() {
  const t = useTranslations("footer");
  const links = t.raw("links") as FooterLink[];

  return (
    <footer className="bg-emerald-950 w-full py-16 px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="group flex items-center gap-2 text-xl font-black text-white uppercase tracking-tighter transition-transform duration-300 hover:scale-[1.01]">
            <AppIcon
              name="eco"
              className="text-primary-fixed transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110"
            />
            {t("brand")}
          </div>
          <div className="flex flex-wrap justify-center gap-8 font-medium text-sm uppercase tracking-widest text-white/60">
            {links.map((item) => (
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
            {t("copyright")}
          </div>
          <div className="flex gap-6">
            <a aria-label="Website" className="text-white/40 transition-all duration-300 hover:-translate-y-0.5 hover:text-white" href="#">
              <AppIcon name="public" />
            </a>
            <a aria-label={t("shareLabel")} className="text-white/40 transition-all duration-300 hover:-translate-y-0.5 hover:text-white" href="#">
              <AppIcon name="share" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
