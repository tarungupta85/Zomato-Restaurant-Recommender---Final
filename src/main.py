import sys
import os
# Add the project root to the python module search path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from typing import List, Optional

from src.filtering import filter_restaurants, get_unique_locations, get_unique_cuisines
from src.prompter import generate_recommendations

app = FastAPI(
    title="Zomato Restaurant Recommender API",
    description="AI-Powered Restaurant Recommendation Service backend",
    version="1.0.0"
)

# CORS Setup: Allow local development frontend (React/Next.js/HTML)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Open to all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request schema
class RecommendRequest(BaseModel):
    location: str = Field(..., description="Restaurant location / neighborhood")
    budget: Optional[str] = Field("any", description="Budget tier: low, medium, high, or any")
    cuisine: Optional[str] = Field("any", description="Cuisine type: e.g., Italian, Chinese, or any")
    min_rating: float = Field(4.0, ge=0.0, le=5.0, description="Minimum restaurant rating")
    options: Optional[List[str]] = Field(default_factory=list, description="Optional flags: family-friendly, pure vegetarian, etc.")
    custom_preferences: Optional[str] = Field("", description="Custom free-form requirements")

# Health check endpoint
@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "Zomato Restaurant Recommender"}

# Recommendation endpoint (AI-Powered rankings & explanations for Phase 3)
@app.post("/api/recommend")
def get_recommendations(payload: RecommendRequest):
    # Perform deterministic filtering
    candidates, warnings = filter_restaurants(
        location=payload.location,
        budget=payload.budget,
        cuisine=payload.cuisine,
        min_rating=payload.min_rating,
        options=payload.options
    )
    
    # Generate AI-curated recommendations and explanations
    recommendations, ai_warnings = generate_recommendations(
        candidates=candidates,
        location=payload.location,
        budget=payload.budget,
        cuisine=payload.cuisine,
        min_rating=payload.min_rating,
        options=payload.options,
        custom_preferences=payload.custom_preferences
    )
    
    # Combine warning lists
    warnings.extend(ai_warnings)
    
    return {
        "status": "success",
        "total_candidates_found": len(candidates),
        "warnings": warnings,
        "recommendations": recommendations
    }

@app.get("/api/locations")
def get_locations():
    return get_unique_locations()

@app.get("/api/cuisines")
def get_cuisines():
    return get_unique_cuisines()

# Resolve absolute paths for the frontend directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")
DIST_DIR = os.path.join(FRONTEND_DIR, "dist")
ASSETS_DIR = os.path.join(DIST_DIR, "assets")

# Mount compiled assets directory if it exists, otherwise mount legacy static
if os.path.exists(ASSETS_DIR):
    app.mount("/assets", StaticFiles(directory=ASSETS_DIR), name="assets")
else:
    STATIC_DIR = os.path.join(FRONTEND_DIR, "static")
    os.makedirs(STATIC_DIR, exist_ok=True)
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

@app.get("/")
def read_index():
    # Try compiled React production build first
    dist_index = os.path.join(DIST_DIR, "index.html")
    if os.path.exists(dist_index):
        return FileResponse(dist_index)
        
    index_path = os.path.join(FRONTEND_DIR, "index.html")
    if not os.path.exists(index_path):
        raise HTTPException(status_code=500, detail="index.html not found in frontend directories")
    return FileResponse(index_path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.main:app", host="127.0.0.1", port=8000, reload=True)
