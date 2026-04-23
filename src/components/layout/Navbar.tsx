/**
 * Navbar component
 * Sticky overlay with blurred backdrop. Contains navigation links and action buttons.
 */
import React from "react";
import Link from "next/link";
import AppIcon from "@/components/ui/app-icon";
import { navbarCopy } from "@/i18n/vi";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md">
      <div className="flex justify-between items-center px-8 py-5 max-w-7xl mx-auto">
        <div className="group flex items-center gap-2 text-2xl font-bold tracking-tighter text-white transition-transform duration-300 hover:scale-[1.01]">
          <AppIcon
            name="eco"
            className="text-primary-fixed transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110"
          />
          {navbarCopy.brand}
        </div>
        <div className="hidden md:flex items-center gap-8 font-medium text-sm tracking-tight text-white/80">
          {navbarCopy.navItems.map((item) => (
            <a
              key={item.label}
              className="relative pb-1 transition-all duration-300 hover:text-white after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-primary-fixed after:transition-transform after:duration-300 hover:after:scale-x-100"
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/auth/login"
            className="hidden sm:block text-sm font-bold text-white/80 hover:text-white transition-colors"
          >
            {navbarCopy.loginLabel}
          </Link>
          <Link
            href="/auth/register"
            className="rounded-lg bg-primary-fixed px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-on-primary-fixed transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 active:scale-95"
          >
            {navbarCopy.registerLabel}
          </Link>
        </div>
      </div>
    </nav>
  );
}
