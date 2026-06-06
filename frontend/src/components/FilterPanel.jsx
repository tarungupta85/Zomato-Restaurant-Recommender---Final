import React from 'react';

const FEATURE_METADATA = [
  { key: 'is_pure_vegetarian', label: 'Pure Veg', icon: 'fa-solid fa-leaf' },
  { key: 'is_family_friendly', label: 'Family Friendly', icon: 'fa-solid fa-users' },
  { key: 'serves_alcohol', label: 'Serves Alcohol', icon: 'fa-solid fa-glass-cheers' },
  { key: 'is_spicy_food', label: 'Spicy Food', icon: 'fa-solid fa-fire' },
  { key: 'is_quick_service', label: 'Quick Service', icon: 'fa-solid fa-bolt' }
];

export default function FilterPanel({
  location,
  setLocation,
  cuisine,
  setCuisine,
  budget,
  setBudget,
  minRating,
  setMinRating,
  activeFeatures,
  toggleFeature,
  customPreferences,
  setCustomPreferences,
  onSubmit,
  locationsList,
  cuisinesList,
  loading
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="w-full md:w-2/5 h-full min-h-0 opacity-0 animate-slide-up"
      style={{ animationDelay: '0.1s' }}
    >
      <div className="glass-panel rounded-xl p-6 flex flex-col gap-6 relative h-full overflow-y-auto">
        {/* Decorative Top Gradient */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#e11d48] to-[#a855f7]"></div>
        
        <h2 className="font-headline-md text-2xl text-white">Find Your Perfect Match</h2>

        {/* Location Select */}
        <div className="flex flex-col gap-2">
          <label className="font-label-md text-xs text-[#94a3b8] tracking-wider uppercase font-bold">Location</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] z-10" style={{ fontVariationSettings: "'FILL' 0" }}>location_on</span>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full bg-[#1e293b]/40 border border-white/10 rounded-lg py-3 pl-10 pr-10 text-white focus:outline-none focus:border-[#e11d48] focus:bg-[#1e293b]/60 transition-all duration-300 font-body-md appearance-none"
            >
              {locationsList.length === 0 ? (
                <option value="" disabled>Loading locations...</option>
              ) : (
                <>
                  <option value="" disabled>Select location...</option>
                  {locationsList.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </>
              )}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" style={{ fontVariationSettings: "'FILL' 0" }}>expand_more</span>
          </div>
        </div>

        {/* Cuisine Select */}
        <div className="flex flex-col gap-2">
          <label className="font-label-md text-xs text-[#94a3b8] tracking-wider uppercase font-bold">Cuisine Preference</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] z-10" style={{ fontVariationSettings: "'FILL' 0" }}>restaurant</span>
            <select
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="w-full bg-[#1e293b]/40 border border-white/10 rounded-lg py-3 pl-10 pr-10 text-white focus:outline-none focus:border-[#e11d48] focus:bg-[#1e293b]/60 transition-all duration-300 font-body-md appearance-none"
            >
              {cuisinesList.length === 0 ? (
                <option value="" disabled>Loading cuisines...</option>
              ) : (
                <>
                  <option value="any">Any Cuisine</option>
                  {cuisinesList.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </>
              )}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" style={{ fontVariationSettings: "'FILL' 0" }}>expand_more</span>
          </div>
        </div>

        {/* Budget Buttons */}
        <div className="flex flex-col gap-2">
          <label className="font-label-md text-xs text-[#94a3b8] tracking-wider uppercase font-bold">Budget</label>
          <div className="flex bg-[#1e293b]/40 p-1 rounded-lg border border-white/10">
            {['any', 'low', 'medium', 'high'].map((tier) => {
              const isActive = budget === tier;
              const label = tier === 'any' ? 'Any' : tier === 'low' ? 'Low ($)' : tier === 'medium' ? 'Medium ($$)' : 'High ($$$)';
              return (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setBudget(tier)}
                  className={`flex-1 py-2 text-center rounded-md font-label-md text-xs font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-[#e11d48] text-white shadow-sm'
                      : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Rating Slider */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <label className="font-label-md text-xs text-[#94a3b8] tracking-wider uppercase font-bold">Minimum Rating</label>
            <span className="bg-[#1e293b] px-2 py-1 rounded text-[#ffb3b6] font-bold text-sm">
              {parseFloat(minRating).toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            min="0.0"
            max="5.0"
            step="0.1"
            value={minRating}
            onChange={(e) => setMinRating(parseFloat(e.target.value))}
            className="range-slider"
          />
        </div>

        {/* Features Tag Chips */}
        <div className="flex flex-col gap-2">
          <label className="font-label-md text-xs text-[#94a3b8] tracking-wider uppercase font-bold">Feature Highlights</label>
          <div className="flex flex-wrap gap-2">
            {FEATURE_METADATA.map(({ key, label, icon }) => {
              const isSelected = activeFeatures.has(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleFeature(key)}
                  className={`px-4 py-2 rounded-full border font-label-md text-xs transition-colors flex items-center gap-1 ${
                    isSelected
                      ? 'border-[#e11d48] bg-[#e11d48]/20 text-[#ffb3b6]'
                      : 'border-white/10 bg-[#1e293b]/40 text-[#94a3b8] hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <i className={`${icon} mr-1`}></i> {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom requirements textarea */}
        <div className="flex flex-col gap-2 mt-2">
          <label className="font-label-md text-xs text-[#94a3b8] tracking-wider uppercase font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-[#7e22ce]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            Custom Requirements (AI Reasoner)
          </label>
          <textarea
            value={customPreferences}
            onChange={(e) => setCustomPreferences(e.target.value)}
            className="w-full bg-[#1e293b]/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#7e22ce] focus:bg-[#1e293b]/60 transition-all duration-300 font-body-md resize-none shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] focus:shadow-[0_0_20px_rgba(126,34,206,0.3)]"
            placeholder="e.g. couple friendly, outdoor rooftop seating, serves complimentary cake, live acoustic music..."
            rows="3"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full bg-[#e11d48] hover:bg-[#be0037] disabled:bg-[#e11d48]/50 text-white font-button text-sm py-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_15px_rgba(225,29,72,0.4)] hover:shadow-[0_0_25px_rgba(225,29,72,0.7)] group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 blur-md group-hover:opacity-100 opacity-0 transition-opacity duration-300"></div>
          <span className="relative z-10">
            {loading ? 'Searching matches...' : 'Get Recommendations'}
          </span>
          <span className="material-symbols-outlined relative z-10 group-hover:translate-x-1 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>
            send
          </span>
        </button>
      </div>
    </form>
  );
}
