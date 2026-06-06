# Phase-Wise Implementation Plan: AI-Powered Restaurant Recommender

This document provides a phase-wise roadmap for building and deploying the AI-Powered Restaurant Recommendation System. It is designed to take the project from environment setup to a fully verified web application.

---

## Phase 1: Environment Setup & Data Ingestion (Estimated Time: 1-2 Days)

### 1.1. Project Initialization
* Initialize the project repository.
* Set up a virtual environment (e.g., using `venv` or `uv`).
* Configure dependency files (`requirements.txt` or `pyproject.toml`).
* Set up environment variables configuration (e.g., `.env` template containing `GEMINI_API_KEY` or `OPENAI_API_KEY`).

### 1.2. Data Ingestion & Preprocessing Pipeline
* Write a script (`src/data_loader.py`) to download the Zomato restaurant recommendation dataset from Hugging Face:
  * Dataset: `ManikaSaini/zomato-restaurant-recommendation`
* Implement data cleaning and normalization:
  * Extract required fields: name, location, cuisine, aggregate rating, average cost, reviews, etc.
  * Map numeric `average_cost` fields into categorical budget tiers:
    * **Low:** Under 400 for two
    * **Medium:** 400 to 1000 for two
    * **High:** Over 1000 for two
  * Normalize location strings (e.g., lowercase, stripping whitespace) to facilitate exact matches.
  * Extract or synthetically tag features (e.g., parsing reviews or tags for "pure vegetarian", "family-friendly", "alcohol").
* Serialize the processed data into a lightweight format (e.g., SQLite file, CSV, or parquet) to avoid reloading from Hugging Face on every application startup.

---

## Phase 2: Core Backend & Filtering Layer (Estimated Time: 2 Days)

### 2.1. Web Server Setup
* Set up a FastAPI or Express backend app.
* Define CORS middleware to allow requests from the frontend app.
* Create basic routing structure.

### 2.2. Deterministic Filtering Engine
* Implement the core querying logic in `src/filtering.py`:
  * Takes input parameters: `location`, `budget`, `cuisine`, and `min_rating`.
  * Returns list of matching restaurants.
* Implement a fallback/ranking strategy when filters are too restrictive:
  * If zero candidates match the exact filters, fallback by widening budget, relaxing cuisines, return warning flags, or suggest nearby locations (rating threshold is always strictly enforced).
* Implement truncation: If more than 15 restaurants match, sort them by rating and select the top 15 to ensure we fit inside LLM context window constraints.

### 2.3. Endpoint Creation
* Expose a test endpoint `/api/health` and the primary search endpoint `POST /api/recommend` (returning raw candidate listings prior to LLM processing).

---

## Phase 3: Integration & LLM Prompt Engineering (Estimated Time: 2 Days)

### 3.1. LLM Client Integration
* Integrate the Google GenAI or OpenAI SDK.
* Configure client authentication and error handling (handling rate limits, timeouts, and quota errors gracefully).

### 3.2. Prompt Development
* Implement prompt templating in `src/prompter.py`:
  * Embed candidate restaurant data (JSON format).
  * Embed user's optional selections and custom free-form queries.
  * Define strict instructions for JSON formatting, scoring criteria, and explanation length.
* Implement Structured JSON output parsing (utilizing Gemini's structured outputs or OpenAI's JSON mode).

### 3.3. API Integration
* Connect the database query output to the prompt builder.
* Update `POST /api/recommend` to return the finalized, LLM-curated and annotated JSON response containing the recommendations and explanations.

---

## Phase 4: Frontend Development (Estimated Time: 2-3 Days)

### 4.1. Design System & Basic Layout
* Set up a modern, responsive user interface with dynamic glassmorphism aesthetics.
* Configure standard fonts, global color tokens (e.g., rich primary reds, dark/light modes, premium neutral grays).

### 4.2. Preference Input Form
* Build a clean UI form with:
  * Location dropdown / autocompletion input.
  * Budget selector (segmented controls or radio cards for Low, Medium, High).
  * Cuisine selector (tags or multi-select dropdown).
  * Rating slider / star rating selector.
  * Optional feature checkboxes (Pure Veg, Family-friendly, Serves Alcohol, etc.).
  * Text area for free-form custom instructions.

### 4.3. Recommendation Cards & Results Display
* Render recommendations inside rich UI cards detailing:
  * Restaurant Name, Cuisine Tags, Rating stars, Cost indicator (e.g., ₹₹).
  * Dedicated section for "AI Reason" or explanation, highlighting matched custom preferences.
* Add micro-animations (skeleton loading states, fade-in transitions, hover scaling on cards).

---

## Phase 5: Testing, Validation & Optimization (Estimated Time: 1-2 Days)

### 5.1. Automated Verification
* Write unit tests for the deterministic filtering module (`tests/test_filtering.py`).
* Write integration tests checking backend prompt generation.

### 5.2. Manual Verification & Edge Case Handling
* Test under the following scenarios:
  * Empty results (e.g., location with no listed restaurants).
  * Prompt injections or malicious inputs in the custom preferences text field.
  * Very slow LLM response times (ensure loaders look premium and responsive).
* Verify layout responsiveness across desktop, tablet, and mobile browsers.
