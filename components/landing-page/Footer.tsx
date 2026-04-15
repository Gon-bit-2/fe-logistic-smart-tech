/**
 * Footer component
 * Website Footer.
 */
import React from 'react';

export interface FooterProps {}

export default function Footer({}: Readonly<FooterProps>) {
  return (
    <footer className="bg-emerald-950 w-full py-16 px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 text-xl font-black text-white uppercase tracking-tighter">
            <span className="material-symbols-outlined text-primary-fixed" data-icon="eco">eco</span>
            Emerald Logistics
          </div>
          <div className="flex flex-wrap justify-center gap-8 font-medium text-sm uppercase tracking-widest text-white/60">
            <a className="hover:text-primary-fixed transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-primary-fixed transition-colors" href="#">Terms of Service</a>
            <a className="hover:text-primary-fixed transition-colors" href="#">Carbon Report</a>
            <a className="hover:text-primary-fixed transition-colors" href="#">Global Network</a>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-4">
          <div className="text-white/40 text-sm tracking-widest uppercase">
            © 2024 Emerald Logistics. Precision in Every Pulse.
          </div>
          <div className="flex gap-6">
            <a className="text-white/40 hover:text-white transition-colors" href="#"><span className="material-symbols-outlined" data-icon="public">public</span></a>
            <a className="text-white/40 hover:text-white transition-colors" href="#"><span className="material-symbols-outlined" data-icon="share">share</span></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
