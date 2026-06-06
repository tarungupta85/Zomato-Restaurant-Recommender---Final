// Client-side interactions for Zomato AI Restaurant Recommender

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const form = document.getElementById('recommend-form');
    const locationSelect = document.getElementById('location');
    const cuisineSelect = document.getElementById('cuisine');
    const ratingSlider = document.getElementById('min-rating');
    const ratingVal = document.getElementById('rating-val');
    const resultsContent = document.getElementById('results-content');
    const resultsCount = document.getElementById('results-count');
    const warningsContainer = document.getElementById('warnings-container');
    const warningsContent = document.getElementById('warnings-content');
    const loadingContainer = document.getElementById('loading-container');
    const loaderMessage = document.getElementById('loader-message');

    const API_BASE = window.location.origin;
    let loadingInterval = null;

    // Image mappings based on cuisine category
    const CUISINE_IMAGES = {
        'italian': 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=600&auto=format&fit=crop&q=80',
        'chinese': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80',
        'asian': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80',
        'indian': 'https://images.unsplash.com/photo-1585938338392-50a59990a4e5?w=600&auto=format&fit=crop&q=80',
        'north indian': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80',
        'south indian': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
        'biryani': 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop&q=80',
        'continental': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
        'fast food': 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&auto=format&fit=crop&q=80',
        'desserts': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&auto=format&fit=crop&q=80',
        'cafe': 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80'
    };

    // 1. Initialize Rating Slider Value display
    ratingSlider.addEventListener('input', (e) => {
        ratingVal.textContent = parseFloat(e.target.value).toFixed(1);
    });

    // 2. Budget Controls Styling and Value Handling
    const budgetButtons = document.querySelectorAll('.budget-btn');
    const budgetInput = document.getElementById('budget-value');
    budgetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            budgetButtons.forEach(b => {
                b.classList.remove('bg-primary-container', 'text-white');
                b.classList.add('text-on-surface-variant', 'hover:text-white', 'hover:bg-white/5');
            });
            btn.classList.add('bg-primary-container', 'text-white');
            btn.classList.remove('text-on-surface-variant', 'hover:text-white', 'hover:bg-white/5');
            budgetInput.value = btn.getAttribute('data-value');
        });
    });

    // 3. Feature Chips Multi-Select Handling
    const featureChips = document.querySelectorAll('.feature-chip');
    const activeFeatures = new Set();
    featureChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const feature = chip.getAttribute('data-feature');
            if (activeFeatures.has(feature)) {
                activeFeatures.delete(feature);
                chip.classList.remove('border-primary-container', 'bg-primary-container/20', 'text-primary');
                chip.classList.add('border-white/10', 'bg-surface-container-highest/40', 'text-on-surface-variant');
            } else {
                activeFeatures.add(feature);
                chip.classList.add('border-primary-container', 'bg-primary-container/20', 'text-primary');
                chip.classList.remove('border-white/10', 'bg-surface-container-highest/40', 'text-on-surface-variant');
            }
        });
    });

    // 4. Fetch Unique Locations and Cuisines to populate filters
    async function populateFilters() {
        try {
            // Fetch Locations
            const locRes = await fetch(`${API_BASE}/api/locations`);
            if (locRes.ok) {
                const locations = await locRes.json();
                locationSelect.innerHTML = '<option value="" disabled selected>Select location...</option>';
                locations.forEach(loc => {
                    const opt = document.createElement('option');
                    opt.value = loc;
                    opt.textContent = loc;
                    locationSelect.appendChild(opt);
                });
            } else {
                throw new Error("Failed to load locations");
            }

            // Fetch Cuisines
            const cuisRes = await fetch(`${API_BASE}/api/cuisines`);
            if (cuisRes.ok) {
                const cuisines = await cuisRes.json();
                cuisineSelect.innerHTML = '<option value="any" selected>Any Cuisine</option>';
                cuisines.forEach(c => {
                    const opt = document.createElement('option');
                    opt.value = c;
                    opt.textContent = c;
                    cuisineSelect.appendChild(opt);
                });
            } else {
                throw new Error("Failed to load cuisines");
            }

        } catch (err) {
            console.error("Error populating filters:", err);
            locationSelect.innerHTML = '<option value="" disabled>Error loading locations</option>';
            cuisineSelect.innerHTML = '<option value="" disabled>Error loading cuisines</option>';
        }
    }

    // 5. Cycle loader messaging
    function startLoaderMessages() {
        const messages = [
            "Scanning Zomato database for matches...",
            "Filtering locations and cuisine constraints...",
            "Evaluating candidate matches...",
            "Finalizing recommendation matches..."
        ];
        let idx = 0;
        loaderMessage.textContent = messages[idx];
        
        loadingInterval = setInterval(() => {
            idx = (idx + 1) % messages.length;
            loaderMessage.textContent = messages[idx];
        }, 2000);
    }

    function stopLoaderMessages() {
        if (loadingInterval) {
            clearInterval(loadingInterval);
            loadingInterval = null;
        }
    }

    // 6. Form Submit & Call API
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Retrieve values
        const location = locationSelect.value;
        const cuisine = cuisineSelect.value;
        const budget = budgetInput.value;
        const minRating = parseFloat(ratingSlider.value);
        const customPreferences = document.getElementById('custom-preferences').value.trim();

        // Collect feature chips
        const options = Array.from(activeFeatures);

        // UI State: Loading
        resultsContent.innerHTML = '';
        resultsCount.style.display = 'none';
        warningsContainer.style.display = 'none';
        loadingContainer.style.display = 'flex';
        startLoaderMessages();

        try {
            const res = await fetch(`${API_BASE}/api/recommend`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    location,
                    budget,
                    cuisine,
                    min_rating: minRating,
                    options,
                    custom_preferences: customPreferences
                })
            });

            stopLoaderMessages();
            loadingContainer.style.display = 'none';

            if (!res.ok) throw new Error(`Server returned HTTP ${res.status}`);

            const data = await res.json();
            renderResults(data);

        } catch (err) {
            stopLoaderMessages();
            loadingContainer.style.display = 'none';
            resultsContent.innerHTML = `
                <div class="empty-state flex flex-col items-center justify-center text-center p-8 glass-panel rounded-xl py-16">
                    <div class="p-4 rounded-full bg-primary-container/10 mb-4 text-primary-container">
                        <span class="material-symbols-outlined text-4xl" style="font-variation-settings: 'FILL' 0;">warning</span>
                    </div>
                    <h3 class="font-headline-md text-xl text-white mb-2">Query Failure</h3>
                    <p class="text-on-surface-variant font-body-md text-sm max-w-sm">${err.message || 'An error occurred while fetching recommendations.'}</p>
                    <button class="mt-4 bg-primary-container hover:bg-[#be0037] text-white font-button text-xs px-6 py-2.5 rounded-lg transition-all" onclick="window.location.reload()">Retry Connection</button>
                </div>
            `;
        }
    });

    // 7. Render results HTML cards
    function renderResults(data) {
        const recommendations = data.recommendations || [];
        const warnings = data.warnings || [];

        // Update count badge
        resultsCount.textContent = `${recommendations.length} recommended`;
        resultsCount.style.display = 'block';

        // Render warnings (filter out LLM/AI model details)
        const userFriendlyWarnings = warnings.filter(w => {
            const low = w.toLowerCase();
            return !low.includes('ai') && !low.includes('gemini') && !low.includes('model') && !low.includes('api key') && !low.includes('quota') && !low.includes('parsing');
        });

        if (userFriendlyWarnings.length > 0) {
            warningsContainer.style.display = 'flex';
            warningsContent.innerHTML = userFriendlyWarnings.map(w => `
                <div class="font-body-md text-sm text-on-surface flex items-start gap-2">
                    <span>• ${w}</span>
                </div>
            `).join('');
        } else {
            warningsContainer.style.display = 'none';
        }

        // Empty state fallback
        if (recommendations.length === 0) {
            resultsContent.innerHTML = `
                <div class="empty-state flex flex-col items-center justify-center text-center p-8 glass-panel rounded-xl py-16">
                    <div class="p-4 rounded-full bg-primary-container/10 mb-4 text-primary-container">
                        <span class="material-symbols-outlined text-4xl" style="font-variation-settings: 'FILL' 0;">sentiment_dissatisfied</span>
                    </div>
                    <h3 class="font-headline-md text-xl text-white mb-2">No Restaurants Found</h3>
                    <p class="text-on-surface-variant font-body-md text-sm max-w-sm">We couldn't locate any dining options matching these criteria, even after relaxing standard parameters. Try widening your filters.</p>
                </div>
            `;
            return;
        }

        // Generate Cards
        resultsContent.innerHTML = recommendations.map(rec => {
            // Cost symbol helper
            let costSymbol = '₹';
            if (rec.estimated_cost_for_two > 400) costSymbol = '₹₹';
            if (rec.estimated_cost_for_two > 1000) costSymbol = '₹₹₹';

            // Image selection based on cuisine
            const cuisineLower = (rec.cuisine || '').toLowerCase();
            let imageUrl = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&auto=format&fit=crop&q=80'; // default fine dining
            for (const [key, url] of Object.entries(CUISINE_IMAGES)) {
                if (cuisineLower.includes(key)) {
                    imageUrl = url;
                    break;
                }
            }

            // Feature flag badges inside card header
            const featuresList = [];
            if (rec.online_order === 'Yes') {
                featuresList.push(`
                    <span class="bg-surface/60 backdrop-blur-md border border-white/10 text-white font-label-md text-[10px] px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                        <i class="fa-solid fa-truck text-[9px] text-primary"></i> Delivery
                    </span>
                `);
            }
            if (rec.book_table === 'Yes') {
                featuresList.push(`
                    <span class="bg-surface/60 backdrop-blur-md border border-white/10 text-white font-label-md text-[10px] px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                        <i class="fa-solid fa-chair text-[9px] text-secondary"></i> Bookable
                    </span>
                `);
            }

            return `
                <div class="glass-panel rounded-xl overflow-hidden flex flex-col group hover:border-primary-container/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_-10px_rgba(225,29,72,0.2)]">
                    <!-- Image Header -->
                    <div class="h-40 w-full relative overflow-hidden bg-surface-container-highest/50">
                        <div class="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/50 to-transparent z-10 opacity-80"></div>
                        <div class="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" style="background-image: url('${imageUrl}');"></div>
                        <!-- Badges -->
                        <div class="absolute top-4 left-4 z-20 flex gap-2 flex-wrap">
                            <span class="bg-green-600/80 backdrop-blur-md text-white font-label-md text-xs px-2.5 py-1 rounded shadow-sm border border-green-400/30 flex items-center gap-1">
                                ${parseFloat(rec.rating).toFixed(1)} <span class="material-symbols-outlined text-[10px]" style="font-variation-settings: 'FILL' 1;">star</span>
                            </span>
                            ${featuresList.join('')}
                        </div>
                    </div>
                    
                    <!-- Content -->
                    <div class="p-5 flex flex-col gap-4 relative z-20 -mt-8 bg-gradient-to-b from-transparent to-surface-container-low/20">
                        <div class="flex justify-between items-start gap-4">
                            <div>
                                <h3 class="font-headline-md text-xl text-white font-bold group-hover:text-primary transition-colors duration-300 drop-shadow-md">${rec.restaurant_name}</h3>
                                <p class="text-on-surface-variant font-body-md text-sm mt-1">${rec.cuisine}</p>
                            </div>
                            <div class="flex items-center gap-1 text-on-surface-variant font-label-md text-sm shrink-0 mt-1">
                                <span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 0;">location_on</span>
                                <span>${rec.location}</span>
                            </div>
                        </div>
                        
                        <!-- Info Row -->
                        <div class="flex gap-4 border-y border-white/10 py-3">
                            <div class="flex items-center gap-1 text-sm text-on-surface">
                                <span class="material-symbols-outlined text-primary-container text-sm" style="font-variation-settings: 'FILL' 0;">payments</span>
                                <span>Avg Cost: ₹${rec.estimated_cost_for_two} (${costSymbol})</span>
                            </div>
                        </div>
                        
                        <!-- AI Justification -->
                        <div class="bg-surface-container-lowest/40 rounded-lg p-4 border border-secondary-container/30 relative overflow-hidden backdrop-blur-sm group-hover:border-secondary-container/50 transition-colors duration-300">
                            <div class="absolute left-0 top-0 w-1 h-full bg-secondary-container shadow-[0_0_10px_rgba(126,34,206,0.8)]"></div>
                            <div class="flex items-start gap-3">
                                <div class="p-1.5 rounded-full bg-secondary-container/10 mt-0.5 shrink-0">
                                    <span class="material-symbols-outlined text-secondary-container text-sm" style="font-variation-settings: 'FILL' 1;">psychology</span>
                                </div>
                                <div>
                                    <h4 class="font-label-md text-xs text-secondary-container mb-1 tracking-wider uppercase font-bold">AI Reasoning</h4>
                                    <p class="font-body-md text-sm text-on-surface-variant leading-relaxed">${rec.ai_explanation || 'Matches query parameters.'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Run population on load
    populateFilters();
});
