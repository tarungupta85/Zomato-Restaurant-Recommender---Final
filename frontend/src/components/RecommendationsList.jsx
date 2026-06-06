import React, { useState } from 'react';
import RecommendationCard from './RecommendationCard';

const CUISINE_IMAGE_GROUPS = {
  'italian': [
    'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80'
  ],
  'chinese': [
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80'
  ],
  'asian': [
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80'
  ],
  'north indian': [
    'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop&q=80'
  ],
  'south indian': [
    'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80'
  ],
  'indian': [
    'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop&q=80'
  ],
  'biryani': [
    'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80'
  ],
  'continental': [
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80'
  ],
  'fast food': [
    'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&auto=format&fit=crop&q=80'
  ],
  'desserts': [
    'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=600&auto=format&fit=crop&q=80'
  ],
  'cafe': [
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&auto=format&fit=crop&q=80'
  ]
};

const GENERAL_IMAGES = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522336572468-97b06e8ef143?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1481931098730-318b6f776db0?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&auto=format&fit=crop&q=80'
];

const assignUniqueImages = (recs) => {
  const used = new Set();
  const assigned = [];

  (recs || []).forEach((rec) => {
    let selectedUrl = null;
    const cuisineLower = (rec.cuisine || '').toLowerCase();

    for (const [key, list] of Object.entries(CUISINE_IMAGE_GROUPS)) {
      if (cuisineLower.includes(key)) {
        const unused = list.filter(url => !used.has(url));
        if (unused.length > 0) {
          let hash = 0;
          const nameStr = rec.restaurant_name || rec.name || '';
          for (let i = 0; i < nameStr.length; i++) {
            hash = nameStr.charCodeAt(i) + ((hash << 5) - hash);
          }
          const index = Math.abs(hash) % unused.length;
          selectedUrl = unused[index];
          break;
        }
      }
    }

    if (!selectedUrl) {
      const unusedGeneral = GENERAL_IMAGES.filter(url => !used.has(url));
      if (unusedGeneral.length > 0) {
        let hash = 0;
        const nameStr = rec.restaurant_name || rec.name || '';
        for (let i = 0; i < nameStr.length; i++) {
          hash = nameStr.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % unusedGeneral.length;
        selectedUrl = unusedGeneral[index];
      }
    }

    if (!selectedUrl) {
      let hash = 0;
      const nameStr = rec.restaurant_name || rec.name || '';
      for (let i = 0; i < nameStr.length; i++) {
        hash = nameStr.charCodeAt(i) + ((hash << 5) - hash);
      }
      const index = Math.abs(hash) % GENERAL_IMAGES.length;
      selectedUrl = GENERAL_IMAGES[index];
    }

    used.add(selectedUrl);
    assigned.push(selectedUrl);
  });

  return assigned;
};

export const getUniqueImage = (name, cuisine) => {
  let hash = 0;
  const nameStr = name || '';
  for (let i = 0; i < nameStr.length; i++) {
    hash = nameStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const offset = Math.abs(hash);

  const cuisineLower = (cuisine || '').toLowerCase();
  for (const [key, list] of Object.entries(CUISINE_IMAGE_GROUPS)) {
    if (cuisineLower.includes(key)) {
      const index = offset % list.length;
      return list[index];
    }
  }

  const index = offset % GENERAL_IMAGES.length;
  return GENERAL_IMAGES[index];
};

export default function RecommendationsList({
  recommendations,
  warnings,
  loading,
  loaderMessage,
  hasSearched,
  error,
  onRetry
}) {
  const [warningsDismissed, setWarningsDismissed] = useState(false);
  const assignedImages = assignUniqueImages(recommendations);

  // Filter out LLM / AI internal warnings client-side to ensure sanitization
  const userFriendlyWarnings = (warnings || []).filter((w) => {
    const low = w.toLowerCase();
    return (
      !low.includes('ai') &&
      !low.includes('gemini') &&
      !low.includes('model') &&
      !low.includes('api key') &&
      !low.includes('quota') &&
      !low.includes('parsing')
    );
  });

  return (
    <section
      className="w-full md:w-3/5 h-full flex flex-col gap-4 overflow-hidden relative opacity-0 animate-slide-in-right"
      style={{ animationDelay: '0.3s' }}
    >
      {/* Dismissible Warning Banner */}
      {userFriendlyWarnings.length > 0 && !warningsDismissed && (
        <div className="bg-[#1e293b]/60 border border-yellow-500/30 rounded-lg p-4 flex items-start gap-3 backdrop-blur-md shrink-0 shadow-lg">
          <span className="material-symbols-outlined text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>
            info
          </span>
          <div className="flex-1">
            {userFriendlyWarnings.map((w, idx) => (
              <div key={idx} className="font-body-md text-sm text-[#d4e4fa] flex items-start gap-2">
                <span>• {w}</span>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="text-[#94a3b8] hover:text-white transition-colors"
            onClick={() => setWarningsDismissed(true)}
          >
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>
              close
            </span>
          </button>
        </div>
      )}

      {/* Content Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto pb-24 md:pb-8 pr-2 custom-scrollbar relative">
        <div className="flex flex-col gap-6">
          {/* Header with results count */}
          <div className="flex justify-between items-center shrink-0">
            <h2 className="font-headline-md text-2xl text-white">
              <i className="fa-solid fa-list icon-gradient mr-1"></i> AI Recommendations
            </h2>
            {hasSearched && !loading && (
              <span className="bg-[#1e293b] px-3 py-1 rounded-full text-xs font-semibold text-[#ffb3b6]">
                {recommendations.length} recommended
              </span>
            )}
          </div>

          {/* State 1: Error Display */}
          {error && (
            <div className="empty-state flex flex-col items-center justify-center text-center p-8 glass-panel rounded-xl py-16">
              <div className="p-4 rounded-full bg-[#e11d48]/10 mb-4 text-[#e11d48]">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 0" }}>
                  warning
                </span>
              </div>
              <h3 className="font-headline-md text-xl text-white mb-2">Query Failure</h3>
              <p className="text-[#94a3b8] font-body-md text-sm max-w-sm">{error}</p>
              <button
                onClick={onRetry}
                className="mt-4 bg-[#e11d48] hover:bg-[#be0037] text-white font-button text-xs px-6 py-2.5 rounded-lg transition-all"
              >
                Retry Connection
              </button>
            </div>
          )}

          {/* State 2: Welcome State (No Search Yet) */}
          {!hasSearched && !loading && !error && (
            <div className="empty-state flex flex-col items-center justify-center text-center p-8 glass-panel rounded-xl py-16">
              <div className="p-4 rounded-full bg-[#e11d48]/10 mb-4">
                <span className="material-symbols-outlined text-4xl text-[#e11d48]" style={{ fontVariationSettings: "'FILL' 0" }}>
                  restaurant
                </span>
              </div>
              <h3 className="font-headline-md text-xl text-white mb-2">Ready to discover?</h3>
              <p className="text-[#94a3b8] font-body-md text-sm max-w-sm">
                Fill in your preferences on the left and hit the search button to generate personalized, AI-justified suggestions.
              </p>
            </div>
          )}

          {/* State 3: Loading Shimmer Loader Grid */}
          {loading && (
            <div className="flex flex-col gap-6 w-full col-span-full">
              <div className="bg-[#1e293b]/60 border border-white/5 rounded-lg p-4 flex items-center gap-3 backdrop-blur-md shrink-0 shadow-lg">
                <div className="w-5 h-5 border-2 border-[#e11d48] border-t-transparent rounded-full animate-spin"></div>
                <div className="font-body-md text-sm text-[#d4e4fa] ml-2">{loaderMessage}</div>
              </div>

              <div className="flex flex-col gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="glass-panel rounded-xl overflow-hidden flex flex-col h-72 animate-pulse">
                    <div className="h-40 w-full skeleton animate-shimmer"></div>
                    <div className="p-5 flex flex-col gap-4 flex-1">
                      <div className="h-6 w-1/3 skeleton animate-shimmer rounded"></div>
                      <div className="h-4 w-1/4 skeleton animate-shimmer rounded"></div>
                      <div className="h-16 w-full skeleton animate-shimmer rounded mt-2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* State 4: Empty State (No results found) */}
          {hasSearched && !loading && !error && recommendations.length === 0 && (
            <div className="empty-state flex flex-col items-center justify-center text-center p-8 glass-panel rounded-xl py-16">
              <div className="p-4 rounded-full bg-[#e11d48]/10 mb-4 text-[#e11d48]">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 0" }}>
                  sentiment_dissatisfied
                </span>
              </div>
              <h3 className="font-headline-md text-xl text-white mb-2">No Restaurants Found</h3>
              <p className="text-[#94a3b8] font-body-md text-sm max-w-sm">
                We couldn't locate any dining options matching these criteria, even after relaxing standard parameters. Try widening your filters.
              </p>
            </div>
          )}

          {/* State 5: Recommendations List Feed */}
          {hasSearched && !loading && !error && recommendations.length > 0 && (
            <div className="flex flex-col gap-6 pb-6">
              {recommendations.map((rec, idx) => (
                <RecommendationCard key={idx} rec={rec} imageUrl={assignedImages[idx]} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
