import os
import re
import pandas as pd
from datasets import load_dataset

def clean_data(df):
    print("Pre-processing and cleaning restaurant data...")
    
    # 1. Clean rating
    def parse_rating(val):
        if pd.isna(val):
            return 0.0
        val = str(val).strip()
        if val in ('NEW', '-', ''):
            return 0.0
        if '/' in val:
            val = val.split('/')[0].strip()
        try:
            return float(val)
        except ValueError:
            return 0.0
            
    df['rating'] = df['rate'].apply(parse_rating)
    
    # 2. Clean cost
    def parse_cost(val):
        if pd.isna(val):
            return 0.0
        val = str(val).replace(',', '').strip()
        try:
            return float(val)
        except ValueError:
            return 0.0
            
    cost_col = 'approx_cost(for two people)'
    df['average_cost_two'] = df[cost_col].apply(parse_cost)
    
    # 3. Map budget tier
    def get_budget_tier(cost):
        if cost <= 0:
            return "medium"  # default fallback
        if cost < 400:
            return "low"
        elif cost <= 1000:
            return "medium"
        else:
            return "high"
            
    df['budget_tier'] = df['average_cost_two'].apply(get_budget_tier)
    
    # 4. Clean location
    df['location'] = df['location'].fillna('').str.strip()
    
    # 5. Clean cuisines
    df['cuisines'] = df['cuisines'].fillna('').str.strip()
    
    # 6. Feature tagging (lowercased searches for robust keyword matching)
    names_lc = df['name'].fillna('').str.lower()
    cuisines_lc = df['cuisines'].fillna('').str.lower()
    rest_type_lc = df['rest_type'].fillna('').str.lower()
    reviews_lc = df['reviews_list'].fillna('').str.lower()
    
    # Pure veg check
    non_veg_keywords = ['chicken', 'mutton', 'fish', 'pork', 'beef', 'meat', 'non veg', 'egg', 'prawn', 'crab', 'seafood']
    def is_pure_veg(row_idx):
        cuisine_str = cuisines_lc.iloc[row_idx]
        name_str = names_lc.iloc[row_idx]
        reviews_str = reviews_lc.iloc[row_idx]
        
        if 'pure veg' in cuisine_str or 'pure veg' in name_str or 'pure vegetarian' in reviews_str or 'pure veg' in reviews_str:
            return True
        if 'veg' in cuisine_str or 'vegetarian' in cuisine_str:
            if not any(kw in cuisine_str or kw in name_str for kw in non_veg_keywords):
                return True
        return False
        
    print("Tagging Pure Vegetarian restaurants...")
    df['is_pure_vegetarian'] = [is_pure_veg(i) for i in range(len(df))]
    
    # Serves alcohol check
    print("Tagging restaurants serving alcohol...")
    alcohol_keywords = ['beer', 'wine', 'whiskey', 'cocktail', 'alcohol', 'liquor', 'bar', 'pub', 'microbrewery', 'brewery', 'lounge']
    df['serves_alcohol'] = (
        rest_type_lc.str.contains('pub|bar|lounge|microbrewery|brewery', regex=True) |
        cuisines_lc.str.contains('finger food', regex=False) |
        names_lc.str.contains('bar|pub|brewery|lounge', regex=True) |
        reviews_lc.apply(lambda r: any(kw in r for kw in alcohol_keywords))
    )
    
    # Family friendly check
    print("Tagging Family-Friendly restaurants...")
    family_keywords = ['family', 'kids', 'children', 'child friendly', 'kids friendly']
    df['is_family_friendly'] = (
        rest_type_lc.str.contains('casual dining|family', regex=True) |
        reviews_lc.apply(lambda r: any(kw in r for kw in family_keywords))
    )
    
    # Spicy food check
    print("Tagging Spicy Food options...")
    spicy_keywords = ['spicy', 'chilli', 'spices', 'spiced', 'szechuan', 'sichuan', 'thai', 'pepper', 'curry']
    df['is_spicy_food'] = (
        cuisines_lc.str.contains('thai|szechuan|sichuan', regex=True) |
        reviews_lc.apply(lambda r: any(kw in r for kw in spicy_keywords))
    )
    
    # Quick service check
    print("Tagging Quick Service restaurants...")
    quick_keywords = ['quick', 'fast', 'speedy', 'express', 'takeaway', 'self service']
    df['is_quick_service'] = (
        rest_type_lc.str.contains('quick bites|fast food|food court|takeaway', regex=True) |
        names_lc.str.contains('express|fast|quick', regex=True) |
        reviews_lc.apply(lambda r: any(kw in r for kw in quick_keywords))
    )
    
    # De-duplicate to keep dataset clean and unique
    print("De-duplicating records based on name and location...")
    df = df.drop_duplicates(subset=['name', 'location'])
    
    # Truncate reviews to keep local cache size low and avoid token bloating
    def truncate_reviews(rev_str):
        if not isinstance(rev_str, str):
            return ""
        return rev_str[:600]
        
    df['reviews_sample'] = df['reviews_list'].apply(truncate_reviews)
    
    columns_to_keep = [
        'name', 'address', 'location', 'cuisines', 'rating', 'votes', 
        'average_cost_two', 'budget_tier', 'online_order', 'book_table', 'rest_type',
        'is_pure_vegetarian', 'serves_alcohol', 'is_family_friendly', 'is_spicy_food', 
        'is_quick_service', 'reviews_sample'
    ]
    return df[columns_to_keep]

def main():
    print("Starting Phase 1 Ingestion Pipeline...")
    
    # Create data output directory if not exists
    os.makedirs("data", exist_ok=True)
    
    output_path = os.path.join("data", "processed_restaurants.csv")
    
    # Ingest from Hugging Face
    try:
        print("Downloading dataset 'ManikaSaini/zomato-restaurant-recommendation' from Hugging Face...")
        dataset = load_dataset("ManikaSaini/zomato-restaurant-recommendation", split="train")
        df_raw = dataset.to_pandas()
        print(f"Dataset downloaded. Raw shape: {df_raw.shape}")
        
        # Clean
        df_cleaned = clean_data(df_raw)
        print(f"Cleaning complete. Processed shape: {df_cleaned.shape}")
        
        # Save to local cache
        print(f"Saving processed data to {output_path}...")
        df_cleaned.to_csv(output_path, index=False, encoding='utf-8')
        print("Phase 1 Ingestion Pipeline finished successfully!")
        
    except Exception as e:
        print(f"CRITICAL ERROR in Ingestion Pipeline: {e}")
        raise e

if __name__ == "__main__":
    main()
