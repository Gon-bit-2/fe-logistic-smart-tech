/**
 * Navbar component
 * Sticky overlay with blurred backdrop. Contains navigation links and action buttons.
 */
import React from 'react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md">
      <div className="flex justify-between items-center px-8 py-5 max-w-7xl mx-auto">
        <div className="group flex items-center gap-2 text-2xl font-bold tracking-tighter text-white transition-transform duration-300 hover:scale-[1.01]">
          <span className="material-symbols-outlined text-primary-fixed transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" data-icon="eco">eco</span>
          Emerald Logistics
        </div>
        <div className="hidden md:flex items-center gap-8 font-medium text-sm tracking-tight text-white/80">
          <a className="relative pb-1 transition-all duration-300 hover:text-white after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-primary-fixed after:transition-transform after:duration-300 hover:after:scale-x-100" href="#">Features</a>
          <a className="relative pb-1 transition-all duration-300 hover:text-white after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-primary-fixed after:transition-transform after:duration-300 hover:after:scale-x-100" href="#">Solutions</a>
          <a className="relative pb-1 transition-all duration-300 hover:text-white after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-primary-fixed after:transition-transform after:duration-300 hover:after:scale-x-100" href="#">Sustainability</a>
          <a className="relative pb-1 transition-all duration-300 hover:text-white after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-primary-fixed after:transition-transform after:duration-300 hover:after:scale-x-100" href="#">About</a>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-widest text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20">
            <span className="material-symbols-outlined text-sm transition-transform duration-300 hover:rotate-90" data-icon="menu">menu</span> Menu
          </button>
          <button className="rounded-lg bg-primary-fixed px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-on-primary-fixed transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 active:scale-95">
            Contact
          </button>
        </div>
      </div>
    </nav>
  );
}
