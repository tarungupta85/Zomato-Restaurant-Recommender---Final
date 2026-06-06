import React from 'react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-12 h-20 bg-[#0f172a]/40 backdrop-blur-xl border-b border-white/5 shadow-sm transition-all duration-200">
      <div className="flex items-center gap-4">
        <h1 className="font-headline-md text-2xl font-bold text-[#ffb3b6] tracking-tight flex items-center gap-2">
          zomato 
          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-gradient-to-r from-[#e11d48] to-[#a855f7] text-white font-label-md text-xs tracking-wider border border-white/20 shadow-[0_0_15px_rgba(225,29,72,0.4)]">AI</span>
        </h1>
        <p className="hidden md:block text-[#94a3b8] font-body-md text-sm border-l border-white/10 pl-4 ml-2">
          Next-generation restaurant matching powered by cognitive reasoning
        </p>
      </div>
      <div className="flex items-center gap-6">
        <button className="text-[#94a3b8] hover:text-white transition-colors duration-200">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>account_circle</span>
        </button>
        <button className="text-[#94a3b8] hover:text-white transition-colors duration-200">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>settings</span>
        </button>
      </div>
    </nav>
  );
}
