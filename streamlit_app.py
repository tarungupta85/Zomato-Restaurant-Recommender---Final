import streamlit as st
import os
from src.filtering import filter_restaurants, get_unique_locations, get_unique_cuisines
from src.prompter import generate_recommendations

# Set page configurations
st.set_page_config(
    page_title="Zomato AI - Premium Restaurant Recommender",
    page_icon="🍴",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom premium styling injection (replicating the dark glassmorphic UI)
st.markdown("""
<style>
    /* Base Body Dark Style */
    .stApp {
        background: linear-gradient(135deg, #0d1e33 0%, #020617 100%) !important;
        color: #f8fafc;
    }
    
    /* Sidebar styling */
    [data-testid="stSidebar"] {
        background-color: rgba(15, 23, 42, 0.8) !important;
        border-right: 1px solid rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
    }
    
    /* Card design */
    .glass-card {
        background: rgba(30, 41, 59, 0.45);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px;
        padding: 20px;
        margin-bottom: 24px;
        backdrop-filter: blur(12px);
        transition: transform 0.3s ease, border-color 0.3s ease;
    }
    .glass-card:hover {
        transform: translateY(-4px);
        border-color: rgba(225, 29, 72, 0.4);
        box-shadow: 0 12px 40px -10px rgba(225, 29, 72, 0.15);
    }
    
    /* Title and details */
    .card-title {
        color: #ffffff;
        font-family: 'Inter', sans-serif;
        font-weight: 700;
        margin: 0 0 4px 0;
        font-size: 1.4rem;
    }
    .cuisine-text {
        color: #94a3b8;
        font-size: 0.85rem;
        margin: 0;
    }
    
    /* Rating Badge */
    .rating-badge {
        background-color: rgba(22, 163, 74, 0.85);
        color: white;
        padding: 4px 10px;
        border-radius: 6px;
        font-weight: bold;
        font-size: 0.8rem;
        display: inline-flex;
        align-items: center;
        gap: 4px;
    }
    
    /* AI reasoning block */
    .ai-block {
        background: rgba(2, 6, 23, 0.4);
        border-left: 4px solid #7e22ce;
        padding: 12px 16px;
        border-radius: 4px 8px 8px 4px;
        margin-top: 12px;
    }
</style>
""", unsafe_allow_html=True)

# Image pools (copied from verified working Unsplash URLs)
CUISINE_IMAGE_GROUPS = {
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
}

GENERAL_IMAGES = [
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
]

def hash_name(name):
    h = 0
    for char in name:
        h = ord(char) + ((h << 5) - h)
    # 32-bit integer simulation
    h = h & 0xffffffff
    if h >= 0x80000000:
        h -= 0x100000000
    return abs(h)

def assign_unique_images(recs):
    used = set()
    assigned = []
    
    for r in recs:
        selected_url = None
        cuisine_lower = r.get("cuisine", "").lower()
        
        # Priority mapping keys (more specific first)
        priority_keys = [
            'north indian', 'south indian', 'biryani', 'italian', 
            'chinese', 'asian', 'continental', 'fast food', 'desserts', 'cafe'
        ]
        
        # Check specific categories first
        for key in priority_keys:
            if key in cuisine_lower and key in CUISINE_IMAGE_GROUPS:
                list_imgs = CUISINE_IMAGE_GROUPS[key]
                unused = [u for u in list_imgs if u not in used]
                if unused:
                    h = hash_name(r.get("restaurant_name", ""))
                    idx = h % len(unused)
                    selected_url = unused[idx]
                    break
        
        # Check overall "indian" key
        if not selected_url and 'indian' in cuisine_lower:
            list_imgs = CUISINE_IMAGE_GROUPS['indian']
            unused = [u for u in list_imgs if u not in used]
            if unused:
                h = hash_name(r.get("restaurant_name", ""))
                idx = h % len(unused)
                selected_url = unused[idx]

        # General Fallback
        if not selected_url:
            unused_general = [u for u in GENERAL_IMAGES if u not in used]
            if unused_general:
                h = hash_name(r.get("restaurant_name", ""))
                idx = h % len(unused_general)
                selected_url = unused_general[idx]
                
        if not selected_url:
            h = hash_name(r.get("restaurant_name", ""))
            idx = h % len(GENERAL_IMAGES)
            selected_url = GENERAL_IMAGES[idx]
            
        used.add(selected_url)
        assigned.append(selected_url)
        
    return assigned

# Streamlit App Title
st.title("🍴 Zomato AI — Restaurant Recommender")
st.caption("Premium Restaurant Recommendations Guided by AI Justifications")

# Sidebar - Filter Panel
st.sidebar.title("Search Preferences")

# Location Select
locations = get_unique_locations()
location = st.sidebar.selectbox("Select Neighborhood", [""] + locations, index=0)

# Cuisine Select
cuisines = get_unique_cuisines()
cuisine = st.sidebar.selectbox("Cuisine Preference", ["any"] + cuisines, index=0)

# Budget Tier
budget = st.sidebar.radio("Budget Tier", ["any", "low", "medium", "high"], index=0)

# Rating slider
min_rating = st.sidebar.slider("Minimum Rating Threshold", 0.0, 5.0, 4.0, step=0.1)

# Options checkboxes
options = []
if st.sidebar.checkbox("Pure Veg Only"):
    options.append("is_pure_vegetarian")
if st.sidebar.checkbox("Serves Alcohol"):
    options.append("serves_alcohol")
if st.sidebar.checkbox("Family Friendly"):
    options.append("is_family_friendly")
if st.sidebar.checkbox("Quick Service"):
    options.append("is_quick_service")

# Custom preferences
custom_preferences = st.sidebar.text_area("Custom Preference Notes (e.g. rooftop, quiet date night)", "")

# Search Button
search_clicked = st.sidebar.button("Get Recommendations", use_container_width=True)

if search_clicked:
    if not location:
        st.warning("Please select a location/neighborhood to begin search.")
    else:
        with st.spinner("Finding matches and preparing AI reasoning..."):
            # Call filter logic
            candidates, filter_warnings = filter_restaurants(
                location=location,
                budget=budget,
                cuisine=cuisine,
                min_rating=min_rating,
                options=options
            )
            
            # Call Gemini curation
            recs, ai_warnings = generate_recommendations(
                candidates=candidates,
                location=location,
                budget=budget,
                cuisine=cuisine,
                min_rating=min_rating,
                options=options,
                custom_preferences=custom_preferences
            )
            
            # Combine warnings (sanitize AI terminology client-side)
            all_warnings = filter_warnings + ai_warnings
            user_warnings = [
                w for w in all_warnings if not any(word in w.lower() for word in ['ai', 'gemini', 'model', 'api key', 'quota', 'parsing'])
            ]
            
            if user_warnings:
                for w in user_warnings:
                    st.info(f"💡 {w}")
                    
            if not recs:
                st.error("No restaurants matching constraints found. Please widen your filter query.")
            else:
                st.subheader(f"AI Recommendations ({len(recs)} matches)")
                
                # Assign distinct images
                assigned_images = assign_unique_images(recs)
                
                # Render results feed
                for idx, r in enumerate(recs):
                    img = assigned_images[idx]
                    cost_symbol = "₹" * (1 if r['estimated_cost_for_two'] <= 400 else 2 if r['estimated_cost_for_two'] <= 1000 else 3)
                    
                    # Layout card structure using HTML markdown rendering
                    card_html = f"""
                    <div class="glass-card">
                        <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                            <div style="flex: 1 1 200px; max-width: 320px; height: 180px; border-radius: 12px; background-image: url('{img}'); background-size: cover; background-position: center; position: relative;">
                                <div style="position: absolute; top: 12px; left: 12px;">
                                    <span class="rating-badge">{r['rating']} ★</span>
                                </div>
                            </div>
                            <div style="flex: 2 2 300px; display: flex; flex-direction: column; justify-content: space-between;">
                                <div>
                                    <h3 class="card-title">{r['restaurant_name']}</h3>
                                    <p class="cuisine-text">{r['cuisine']} &bull; {r['location']}</p>
                                    <p style="font-size: 0.9rem; color: #cbd5e1; margin-top: 8px; margin-bottom: 8px;">
                                        Avg Cost for Two: <strong>₹{r['estimated_cost_for_two']}</strong> ({cost_symbol})
                                    </p>
                                    <div class="ai-block">
                                        <span style="font-size: 0.75rem; color: #a855f7; font-weight: bold; letter-spacing: 0.05em; text-transform: uppercase;">AI Reasoning</span>
                                        <p style="margin: 4px 0 0 0; font-size: 0.88rem; color: #94a3b8; line-height: 1.5;">{r['ai_explanation']}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    """
                    st.markdown(card_html, unsafe_allow_html=True)
