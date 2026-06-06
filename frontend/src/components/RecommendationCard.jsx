import React from 'react';
import { getUniqueImage } from './RecommendationsList';

export default function RecommendationCard({ rec, imageUrl }) {
  // Determine cost tier symbols
  let costSymbol = '₹';
  if (rec.estimated_cost_for_two > 400) costSymbol = '₹₹';
  if (rec.estimated_cost_for_two > 1000) costSymbol = '₹₹₹';

  // Determine unique image (use prop if provided, otherwise fallback to local unique selection)
  const cardImage = imageUrl || getUniqueImage(rec.restaurant_name, rec.cuisine);

  return (
    <div className="glass-panel rounded-xl overflow-hidden flex flex-col group hover:border-[#e11d48]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_-10px_rgba(225,29,72,0.2)]">
      {/* Image Header */}
      <div className="h-40 w-full relative overflow-hidden bg-[#273647]/50">
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent z-10 opacity-80"></div>
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
          style={{ backgroundImage: `url('${cardImage}')` }}
        />
        {/* Badges */}
        <div className="absolute top-4 left-4 z-20 flex gap-2 flex-wrap">
          <span className="bg-green-600/80 backdrop-blur-md text-white font-label-md text-xs px-2.5 py-1 rounded shadow-sm border border-green-400/30 flex items-center gap-1">
            {parseFloat(rec.rating).toFixed(1)}{' '}
            <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
          </span>
          {rec.online_order === 'Yes' && (
            <span className="bg-[#0f172a]/60 backdrop-blur-md border border-white/10 text-white font-label-md text-[10px] px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
              <i className="fa-solid fa-truck text-[9px] text-[#ffb3b6]"></i> Delivery
            </span>
          )}
          {rec.book_table === 'Yes' && (
            <span className="bg-[#0f172a]/60 backdrop-blur-md border border-white/10 text-white font-label-md text-[10px] px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
              <i className="fa-solid fa-chair text-[9px] text-[#a855f7]"></i> Bookable
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-4 relative z-20 -mt-8 bg-gradient-to-b from-transparent to-[#0d1c2d]/20 flex-1">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="font-headline-md text-xl text-white font-bold group-hover:text-[#ffb3b6] transition-colors duration-300 drop-shadow-md">
              {rec.restaurant_name}
            </h3>
            <p className="text-[#94a3b8] font-body-md text-sm mt-1">{rec.cuisine}</p>
          </div>
          <div className="flex items-center gap-1 text-[#94a3b8] font-label-md text-sm shrink-0 mt-1">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>
              location_on
            </span>
            <span>{rec.location}</span>
          </div>
        </div>

        {/* Info Row */}
        <div className="flex gap-4 border-y border-white/10 py-3">
          <div className="flex items-center gap-1 text-sm text-[#d4e4fa]">
            <span className="material-symbols-outlined text-[#e11d48] text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>
              payments
            </span>
            <span>Avg Cost: ₹{rec.estimated_cost_for_two} ({costSymbol})</span>
          </div>
        </div>

        {/* AI Justification */}
        <div className="bg-[#020617]/40 rounded-lg p-4 border border-[#a855f7]/30 relative overflow-hidden backdrop-blur-sm group-hover:border-[#a855f7]/50 transition-colors duration-300">
          <div className="absolute left-0 top-0 w-1 h-full bg-[#7e22ce] shadow-[0_0_10px_rgba(126,34,206,0.8)]"></div>
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-full bg-[#7e22ce]/10 mt-0.5 shrink-0">
              <span className="material-symbols-outlined text-[#7e22ce] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                psychology
              </span>
            </div>
            <div>
              <h4 className="font-label-md text-xs text-[#a855f7] mb-1 tracking-wider uppercase font-bold">
                AI Reasoning
              </h4>
              <p className="font-body-md text-sm text-[#94a3b8] leading-relaxed">
                {rec.ai_explanation || 'Matches query parameters.'}
              </p>
            </div>
          </div>
        </div>

        {/* Book Table Action Button */}
        <div className="mt-2 flex justify-end">
          <button className="bg-transparent border border-white/20 text-white hover:border-[#ffb3b6] hover:text-[#ffb3b6] hover:bg-[#ffb3b6]/5 font-button text-sm px-6 py-2.5 rounded-lg transition-all duration-300 flex items-center gap-2 group/btn">
            Book Table
            <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform" style={{ fontVariationSettings: "'FILL' 0" }}>
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
