import os
import pandas as pd
from typing import List, Dict, Any, Tuple

# Path to the preprocessed dataset
DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "processed_restaurants.csv")

# Set of non-cuisine items (dishes, beverages, etc.) to exclude from the cuisine list
NON_CUISINES = {
    'bbq', 'bakery', 'bar food', 'beverages', 'biryani', 'bubble tea', 'burger',
    'cafe', 'charcoal chicken', 'coffee', 'desserts', 'drinks only', 'fast food',
    'finger food', 'grill', 'healthy food', 'hot dogs', 'ice cream', 'juices',
    'kebab', 'mithai', 'momos', 'paan', 'pizza', 'raw meats', 'roast chicken',
    'rolls', 'salad', 'sandwich', 'seafood', 'steak', 'street food', 'sushi',
    'tea', 'vegan', 'wraps'
}

def load_data() -> pd.DataFrame:
    """Loads the preprocessed Zomato dataset."""
    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"Processed restaurant database not found at {DATA_PATH}. Please run data_loader.py first.")
    return pd.read_csv(DATA_PATH)

def filter_restaurants(
    location: str,
    budget: str,
    cuisine: str,
    min_rating: float,
    options: List[str] = None
) -> Tuple[List[Dict[str, Any]], List[str]]:
    """
    Filters restaurants based strictly on user constraints.
    No automatic relaxation or expansion of constraints is performed.
    """
    try:
        df = load_data()
    except Exception as e:
        return [], [f"Database error: {str(e)}"]

    # Fill NaN values in object columns
    df['location'] = df['location'].fillna('')
    df['cuisines'] = df['cuisines'].fillna('')
    df['budget_tier'] = df['budget_tier'].fillna('medium')
    
    loc_clean = location.strip().lower() if location else ""
    budget_clean = budget.strip().lower() if budget else "any"
    cuisine_clean = cuisine.strip().lower() if cuisine else "any"
    
    use_budget = budget_clean != "any" and budget_clean != ""
    use_cuisine = cuisine_clean != "any" and cuisine_clean != ""
    
    # Query Conditions
    loc_cond = (df['location'].str.lower() == loc_clean)
    
    budget_cond = True
    if use_budget:
        budget_cond = (df['budget_tier'].str.lower() == budget_clean)
        
    cuisine_cond = True
    if use_cuisine:
        cuisine_cond = df['cuisines'].str.lower().str.contains(cuisine_clean, na=False, regex=False)
        
    rating_cond = (df['rating'] >= min_rating)
    
    # Feature options filtering
    option_cond = True
    if options:
        for opt in options:
            if opt in df.columns:
                option_cond = option_cond & (df[opt] == True)

    # Strict Match ONLY (No relaxation logic)
    accumulated_df = df[loc_cond & budget_cond & cuisine_cond & rating_cond & option_cond].copy()
    
    return format_results(accumulated_df), []

def format_results(df: pd.DataFrame) -> List[Dict[str, Any]]:
    """Sorts, truncates, and formats the output DataFrame to a list of dicts."""
    # Sort by rating (descending) and votes (descending)
    sorted_df = df.sort_values(by=['rating', 'votes'], ascending=[False, False])
    
    # Truncate to top 15 candidate restaurants
    top_15 = sorted_df.head(15)
    
    # Convert types to python native types
    results = []
    for _, row in top_15.iterrows():
        results.append({
            "name": str(row['name']),
            "address": str(row['address']),
            "location": str(row['location']),
            "cuisines": str(row['cuisines']),
            "rating": float(row['rating']),
            "votes": int(row['votes']),
            "average_cost_two": float(row['average_cost_two']),
            "budget_tier": str(row['budget_tier']),
            "online_order": str(row['online_order']),
            "book_table": str(row['book_table']),
            "rest_type": str(row['rest_type']) if pd.notna(row['rest_type']) else "",
            "is_pure_vegetarian": bool(row['is_pure_vegetarian']),
            "serves_alcohol": bool(row['serves_alcohol']),
            "is_family_friendly": bool(row['is_family_friendly']),
            "is_spicy_food": bool(row['is_spicy_food']),
            "is_quick_service": bool(row['is_quick_service']),
            "reviews_sample": str(row['reviews_sample']) if pd.notna(row['reviews_sample']) else ""
        })
    return results

def get_unique_locations() -> List[str]:
    """Retrieves unique, sorted locations from the preprocessed database."""
    try:
        df = load_data()
        locations = df['location'].dropna().unique().tolist()
        return sorted([str(loc) for loc in locations if str(loc).strip()])
    except Exception:
        return ["Banashankari", "Basavanagudi", "JP Nagar", "Jayanagar", "Whitefield", "Indiranagar", "Malleshwaram"]

def get_unique_cuisines() -> List[str]:
    """Retrieves unique, sorted cuisines from the preprocessed database, filtering out non-cuisine items."""
    try:
        df = load_data()
        cuisines_set = set()
        for c_list in df['cuisines'].dropna().unique():
            for c in str(c_list).split(','):
                c_clean = c.strip()
                if c_clean and c_clean.lower() not in NON_CUISINES:
                    cuisines_set.add(c_clean)
        return sorted(list(cuisines_set))
    except Exception:
        return ["North Indian", "Chinese", "South Indian", "Continental", "Italian", "Thai", "Mexican", "Mediterranean"]
