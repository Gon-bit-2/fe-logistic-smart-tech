/**
 * Navbar component
 * Sticky overlay with blurred backdrop. Contains navigation links and action buttons.
 */
import React from 'react';

export interface NavbarProps {}

export default function Navbar({}: Readonly<NavbarProps>) {
  return (
    <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md">
      <div className="flex justify-between items-center px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-white">
          <span className="material-symbols-outlined text-primary-fixed" data-icon="eco">eco</span>
          Emerald Logistics
        </div>
        <div className="hidden md:flex items-center gap-8 font-medium text-sm tracking-tight text-white/80">
          <a className="hover:text-white transition-colors duration-300" href="#">Features</a>
          <a className="hover:text-white transition-colors duration-300" href="#">Solutions</a>
          <a className="hover:text-white transition-colors duration-300" href="#">Sustainability</a>
          <a className="hover:text-white transition-colors duration-300" href="#">About</a>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-white/10 hover:bg-white/20 text-white font-medium text-xs uppercase tracking-widest px-4 py-2 rounded-lg transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-sm" data-icon="menu">menu</span> Menu
          </button>
          <button className="bg-primary-fixed text-on-primary-fixed font-bold text-xs uppercase tracking-widest px-6 py-2.5 rounded-lg transition-all hover:brightness-110 active:scale-95">
            Contact
          </button>
        </div>
      </div>
    </nav>
  );
}
