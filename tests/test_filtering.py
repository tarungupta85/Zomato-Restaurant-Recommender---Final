import pytest
from src.filtering import filter_restaurants, load_data

def test_load_data():
    df = load_data()
    assert not df.empty
    assert "name" in df.columns
    assert "location" in df.columns
    assert "cuisines" in df.columns
    assert "rating" in df.columns
    assert "budget_tier" in df.columns

def test_strict_match():
    # Banashankari is a known location in our dataset with medium budget North Indian food
    results, warnings = filter_restaurants(
        location="Banashankari",
        budget="medium",
        cuisine="North Indian",
        min_rating=3.0
    )
    assert len(results) > 0
    assert len(warnings) == 0
    # Check details of first restaurant
    first = results[0]
    assert first["location"].lower() == "banashankari"
    assert first["budget_tier"] == "medium"
    assert "north indian" in first["cuisines"].lower()
    assert first["rating"] >= 3.0

def test_no_rating_relaxation():
    # Test that rating constraints are strictly enforced and never relaxed
    results, warnings = filter_restaurants(
        location="Banashankari",
        budget="medium",
        cuisine="North Indian",
        min_rating=5.1
    )
    assert len(results) == 0

def test_no_budget_relaxation():
    # Search for something that doesn't exist strictly under high budget Thai food.
    # It should return empty results and no warnings because relaxation is disabled.
    results, warnings = filter_restaurants(
        location="Banashankari",
        budget="high",
        cuisine="Thai",
        min_rating=4.0
    )
    assert len(results) == 0
    assert len(warnings) == 0

def test_no_cuisine_relaxation():
    # Search for an impossible cuisine (e.g. "Marsian Food").
    # It should return empty results and no warnings.
    results, warnings = filter_restaurants(
        location="Banashankari",
        budget="medium",
        cuisine="Marsian Food",
        min_rating=4.0
    )
    assert len(results) == 0
    assert len(warnings) == 0

def test_optional_budget_and_cuisine():
    # Test when budget and cuisine are both "any"
    results, warnings = filter_restaurants(
        location="Banashankari",
        budget="any",
        cuisine="any",
        min_rating=3.0
    )
    assert len(results) >= 5
    names = [r["name"].lower() for r in results]
    assert "taaza thindi" in names

    # Test when budget is "any" but cuisine is specific
    results, warnings = filter_restaurants(
        location="Banashankari",
        budget="any",
        cuisine="North Indian",
        min_rating=3.0
    )
    assert len(results) >= 5
    # The first result (highest rated strict match) must be North Indian
    assert "north indian" in results[0]["cuisines"].lower()

def test_get_unique_cuisines():
    from src.filtering import get_unique_cuisines
    cuisines = get_unique_cuisines()
    assert isinstance(cuisines, list)
    assert len(cuisines) > 0
    # Valid cuisines should be present
    assert "North Indian" in cuisines
    assert "Italian" in cuisines
    assert "Chinese" in cuisines
    # Non-cuisines / dishes / beverages should be filtered out
    assert "Pizza" not in cuisines
    assert "Cake" not in cuisines
    assert "Burger" not in cuisines
    assert "Desserts" not in cuisines
    assert "Fast Food" not in cuisines
    assert "Beverages" not in cuisines

