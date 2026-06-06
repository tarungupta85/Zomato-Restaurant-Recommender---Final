import os
import json
from typing import List, Dict, Any, Tuple
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from google import genai
from google.genai import types

# Load environment variables
load_dotenv()

# Define Pydantic structures for Gemini Structured Output
class AIRecommendation(BaseModel):
    restaurant_name: str = Field(..., description="The name of the restaurant, matching the candidate name exactly")
    cuisine: str = Field(..., description="Cuisine type of the restaurant")
    rating: float = Field(..., description="Restaurant rating")
    estimated_cost_for_two: float = Field(..., description="Estimated cost for two people")
    ai_explanation: str = Field(..., description="A 1-2 sentence personalized explanation of why this restaurant matches the user's query and tags")

class AIRecommendationsResponse(BaseModel):
    recommendations: List[AIRecommendation] = Field(..., description="List of ranked restaurant recommendations")

def get_gemini_client() -> genai.Client:
    """Initializes and returns the Gemini GenAI client."""
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key or api_key == "your_api_key_here":
        raise ValueError("GEMINI_API_KEY is not set in environment or .env file.")
    return genai.Client(api_key=api_key)

def generate_recommendations(
    candidates: List[Dict[str, Any]],
    location: str,
    budget: str,
    cuisine: str,
    min_rating: float,
    options: List[str],
    custom_preferences: str
) -> Tuple[List[Dict[str, Any]], List[str]]:
    """
    Ranks the database candidates using Gemini and generates explanations.
    If Gemini fails, it falls back to the database-sorted list with default explanations.
    """
    warnings = []
    
    # Check if we have any candidates to rank
    if not candidates:
        return [], warnings

    try:
        client = get_gemini_client()
    except Exception as e:
        warnings.append(f"AI ranking unavailable: {str(e)}. Displaying standard database results.")
        return get_fallback_recommendations(candidates, "AI ranking is currently offline. This restaurant matches your filters for cuisine, location, and budget."), warnings

    # Truncate candidates to pass to LLM to save token cost and context window
    # Keep only required fields for reasoning
    candidates_context = []
    for c in candidates:
        candidates_context.append({
            "name": c["name"],
            "cuisine": c["cuisines"],
            "rating": c["rating"],
            "average_cost_two": c["average_cost_two"],
            "is_pure_vegetarian": c["is_pure_vegetarian"],
            "serves_alcohol": c["serves_alcohol"],
            "is_family_friendly": c["is_family_friendly"],
            "is_spicy_food": c["is_spicy_food"],
            "is_quick_service": c["is_quick_service"],
            "reviews_snippet": c["reviews_sample"][:400]  # keep snippet short
        })

    # Construct prompts
    system_instruction = (
        "You are a Zomato Restaurant Recommendation assistant.\n"
        "Your task is to select, rank, and explain the top 5 best matching candidate restaurants. "
        "You MUST return exactly 5 recommendations in your JSON list if at least 5 candidates are provided in the context. "
        "If fewer than 5 candidates are provided, return all of them.\n\n"
        "RANKING CRITERIA:\n"
        "1. Prioritize candidates matching the user's optional checkboxes (options).\n"
        "2. Rank highly those matching the user's custom free-form preferences (look for matches in reviews and cuisines).\n"
        "3. Incorporate aggregate ratings and cost parameters.\n\n"
        "EXPLANATION GUIDELINES:\n"
        "- Write a concise 1-2 sentence personalized explanation for each recommended restaurant.\n"
        "- Connect user preferences directly to restaurant attributes (e.g., 'Selected because it serves vegetarian Italian dishes and matches your rooftop requirement mentioned in reviews').\n"
        "- Never make up facts. Only use information provided in the candidates context."
    )

    prompt = f"""
User Request Details:
- Location: {location}
- Budget Tier: {budget}
- Cuisine: {cuisine}
- Minimum Rating: {min_rating}
- Selected Preset Option Tags: {options}
- Custom / Free-form Preferences: {custom_preferences}

Candidate Restaurants Context:
{json.dumps(candidates_context, indent=2)}

Please select and rank the top 5 best matching candidates and return them according to the JSON schema.
"""

    response = None
    last_err = None
    used_fallback = False
    
    # Try primary model first, fallback to lite if primary fails (e.g. daily quota reached)
    for model_name in ['gemini-2.5-flash', 'gemini-2.5-flash-lite']:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=AIRecommendationsResponse,
                    system_instruction=system_instruction
                )
            )
            if model_name != 'gemini-2.5-flash':
                used_fallback = True
            break
        except Exception as model_err:
            last_err = model_err
            continue

    if response is None:
        warnings.append(f"AI ranking API error: {str(last_err)}. Falling back to database ranking.")
        return get_fallback_recommendations(candidates, "Selected based on matching rating, cuisines, and location constraints."), warnings

    if used_fallback:
        warnings.append("AI engine shifted to fallback model (Gemini 2.5 Flash Lite) due to primary model quota limits.")

    try:
        # Parse output JSON
        data = json.loads(response.text)
        
        # Merge AI explanations back into rich candidate data
        recommendations = []
        candidates_by_name = {c["name"].lower().strip(): c for c in candidates}
        
        for rec in data.get("recommendations", []):
            rec_name = rec.get("restaurant_name", "")
            name_clean = rec_name.lower().strip()
            
            if name_clean in candidates_by_name:
                orig = candidates_by_name[name_clean]
                recommendations.append({
                    "restaurant_name": orig["name"],
                    "cuisine": orig["cuisines"],
                    "rating": orig["rating"],
                    "estimated_cost_for_two": orig["average_cost_two"],
                    "address": orig["address"],
                    "location": orig["location"],
                    "online_order": orig["online_order"],
                    "book_table": orig["book_table"],
                    "rest_type": orig["rest_type"],
                    "ai_explanation": rec.get("ai_explanation", "")
                })
            else:
                # If name didn't match exactly, fallback to what LLM returned
                recommendations.append({
                    "restaurant_name": rec_name,
                    "cuisine": rec.get("cuisine", ""),
                    "rating": rec.get("rating", 0.0),
                    "estimated_cost_for_two": rec.get("estimated_cost_for_two", 0.0),
                    "address": "Address not found",
                    "location": location,
                    "online_order": "No",
                    "book_table": "No",
                    "rest_type": "",
                    "ai_explanation": rec.get("ai_explanation", "")
                })
                
        # If the LLM returned nothing or failed to parse, use fallback
        if not recommendations:
            return get_fallback_recommendations(candidates, "Matches your filter criteria."), warnings
            
        return recommendations, warnings

    except Exception as e:
        warnings.append(f"AI response parsing error: {str(e)}. Falling back to database ranking.")
        return get_fallback_recommendations(candidates, "Selected based on matching rating, cuisines, and location constraints."), warnings

def get_fallback_recommendations(candidates: List[Dict[str, Any]], default_reason: str) -> List[Dict[str, Any]]:
    """Helper to convert raw candidates to recommendations schema in case of LLM failures."""
    fallback_recs = []
    # Take top 5 candidates
    for orig in candidates[:5]:
        fallback_recs.append({
            "restaurant_name": orig["name"],
            "cuisine": orig["cuisines"],
            "rating": orig["rating"],
            "estimated_cost_for_two": orig["average_cost_two"],
            "address": orig["address"],
            "location": orig["location"],
            "online_order": orig["online_order"],
            "book_table": orig["book_table"],
            "rest_type": orig["rest_type"],
            "ai_explanation": default_reason
        })
    return fallback_recs
