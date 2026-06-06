import os
import pytest
from src.prompter import generate_recommendations, get_fallback_recommendations

def test_fallback_logic():
    # Construct some mock candidates
    candidates = [
        {
            "name": "Jalsa",
            "address": "Banashankari",
            "location": "Banashankari",
            "cuisines": "North Indian, Chinese",
            "rating": 4.1,
            "votes": 775,
            "average_cost_two": 800.0,
            "budget_tier": "medium",
            "online_order": "Yes",
            "book_table": "Yes",
            "rest_type": "Casual Dining",
            "is_pure_vegetarian": False,
            "serves_alcohol": False,
            "is_family_friendly": True,
            "is_spicy_food": True,
            "is_quick_service": False,
            "reviews_sample": "Nice place"
        }
    ]
    
    # Save the original API key if it exists
    orig_key = os.environ.get("GEMINI_API_KEY")
    
    # Temporarily remove or set to placeholder
    os.environ["GEMINI_API_KEY"] = "your_api_key_here"
    
    try:
        # This should trigger the fallback logic without throwing an unhandled exception
        recommendations, warnings = generate_recommendations(
            candidates=candidates,
            location="Banashankari",
            budget="medium",
            cuisine="North Indian",
            min_rating=4.0,
            options=[],
            custom_preferences="rooftop"
        )
        
        # Verify fallback recommendations are returned
        assert len(recommendations) == 1
        assert recommendations[0]["restaurant_name"] == "Jalsa"
        assert len(warnings) > 0
        assert "AI ranking unavailable" in warnings[0] or "API key" in warnings[0]
        
    finally:
        # Restore original key
        if orig_key is not None:
            os.environ["GEMINI_API_KEY"] = orig_key
        else:
            os.environ.pop("GEMINI_API_KEY", None)

def test_get_fallback_recommendations():
    candidates = [
        {"name": "Rest A", "cuisines": "Italian", "rating": 4.5, "average_cost_two": 500, "address": "Addr A", "location": "Loc A", "online_order": "Yes", "book_table": "No", "rest_type": "Cafe"},
        {"name": "Rest B", "cuisines": "Italian", "rating": 4.2, "average_cost_two": 600, "address": "Addr B", "location": "Loc B", "online_order": "No", "book_table": "Yes", "rest_type": "Cafe"}
    ]
    recs = get_fallback_recommendations(candidates, "Fallback reason")
    assert len(recs) == 2
    assert recs[0]["restaurant_name"] == "Rest A"
    assert recs[0]["ai_explanation"] == "Fallback reason"
