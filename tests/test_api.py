import pytest
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_get_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "Zomato" in data["service"]

def test_get_locations():
    response = client.get("/api/locations")
    assert response.status_code == 200
    locations = response.json()
    assert isinstance(locations, list)
    assert len(locations) > 0
    assert "Banashankari" in locations

def test_get_cuisines():
    response = client.get("/api/cuisines")
    assert response.status_code == 200
    cuisines = response.json()
    assert isinstance(cuisines, list)
    assert len(cuisines) > 0
    assert "North Indian" in cuisines

def test_post_recommend_validation():
    payload = {
        "location": "Banashankari",
        "budget": "medium",
        "cuisine": "North Indian",
        "min_rating": 4.0,
        "options": [],
        "custom_preferences": "rooftop seating"
    }
    response = client.post("/api/recommend", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "total_candidates_found" in data
    assert "recommendations" in data
    assert isinstance(data["recommendations"], list)
    
    if "warnings" in data and len(data["warnings"]) > 0:
        assert "AI ranking" in data["warnings"][0] or "GEMINI_API_KEY" in data["warnings"][0] or "shifted to fallback model" in data["warnings"][0]
        if len(data["recommendations"]) > 0:
            assert "ai_explanation" in data["recommendations"][0]

def test_post_recommend_missing_fields():
    payload = {
        "budget": "medium",
        "cuisine": "North Indian",
        "min_rating": 4.0
    }
    response = client.post("/api/recommend", json=payload)
    assert response.status_code == 422

def test_post_recommend_optional_fields():
    # Test with omitted budget and cuisine (should default to "any")
    payload = {
        "location": "Banashankari",
        "min_rating": 3.0
    }
    response = client.post("/api/recommend", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["total_candidates_found"] >= 5
    assert len(data["recommendations"]) > 0

    # Test with budget and cuisine explicitly set to None / null
    payload_null = {
        "location": "Banashankari",
        "budget": None,
        "cuisine": None,
        "min_rating": 3.0
    }
    response_null = client.post("/api/recommend", json=payload_null)
    assert response_null.status_code == 200
    data_null = response_null.json()
    assert data_null["status"] == "success"
    assert data_null["total_candidates_found"] >= 5

