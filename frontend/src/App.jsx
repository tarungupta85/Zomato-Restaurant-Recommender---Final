import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import FilterPanel from './components/FilterPanel';
import RecommendationsList from './components/RecommendationsList';

const API_BASE = window.location.origin;

const LOADER_MESSAGES = [
  "Scanning Zomato database for matches...",
  "Filtering locations and cuisine constraints...",
  "Evaluating candidate matches...",
  "Finalizing recommendation matches..."
];

export default function App() {
  // Input states
  const [location, setLocation] = useState('');
  const [cuisine, setCuisine] = useState('any');
  const [budget, setBudget] = useState('any');
  const [minRating, setMinRating] = useState(4.0);
  const [activeFeatures, setActiveFeatures] = useState(new Set());
  const [customPreferences, setCustomPreferences] = useState('');

  // API metadata lists
  const [locationsList, setLocationsList] = useState([]);
  const [cuisinesList, setCuisinesList] = useState([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState(LOADER_MESSAGES[0]);
  const [recommendations, setRecommendations] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Load locations and cuisines
  useEffect(() => {
    async function loadFilters() {
      try {
        const locRes = await fetch(`${API_BASE}/api/locations`);
        if (locRes.ok) {
          const locs = await locRes.json();
          setLocationsList(locs);
        } else {
          throw new Error('Failed to load locations');
        }

        const cuisRes = await fetch(`${API_BASE}/api/cuisines`);
        if (cuisRes.ok) {
          const cuis = await cuisRes.json();
          setCuisinesList(cuis);
        } else {
          throw new Error('Failed to load cuisines');
        }
      } catch (err) {
        console.error('Error loading filter lists:', err);
        setError('Error loading locations or cuisines. Please refresh.');
      }
    }
    loadFilters();
  }, []);

  // Cycle loader messages when loading is active
  useEffect(() => {
    let interval = null;
    if (loading) {
      let idx = 0;
      setLoaderMessage(LOADER_MESSAGES[idx]);
      interval = setInterval(() => {
        idx = (idx + 1) % LOADER_MESSAGES.length;
        setLoaderMessage(LOADER_MESSAGES[idx]);
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading]);

  const toggleFeature = (feature) => {
    setActiveFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(feature)) {
        next.delete(feature);
      } else {
        next.add(feature);
      }
      return next;
    });
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setRecommendations([]);
    setWarnings([]);

    try {
      const res = await fetch(`${API_BASE}/api/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location,
          budget,
          cuisine,
          min_rating: minRating,
          options: Array.from(activeFeatures),
          custom_preferences: customPreferences
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      setRecommendations(data.recommendations || []);
      setWarnings(data.warnings || []);
    } catch (err) {
      console.error('API Query Error:', err);
      setError(err.message || 'An error occurred while fetching recommendations.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="text-on-surface min-h-screen overflow-x-hidden md:overflow-y-hidden font-body-md selection:bg-primary-container selection:text-white bg-transparent">
      {/* Ambient Background Glows */}
      <div className="ambient-bg">
        <div className="ambient-orb-1 animate-spin-slow origin-center"></div>
        <div className="ambient-orb-2 animate-spin-reverse-slow origin-center"></div>
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Dashboard container */}
      <main className="pt-24 pb-8 px-6 md:px-12 h-screen flex flex-col md:flex-row gap-6 max-w-7xl mx-auto overflow-hidden">
        <FilterPanel
          location={location}
          setLocation={setLocation}
          cuisine={cuisine}
          setCuisine={setCuisine}
          budget={budget}
          setBudget={setBudget}
          minRating={minRating}
          setMinRating={setMinRating}
          activeFeatures={activeFeatures}
          toggleFeature={toggleFeature}
          customPreferences={customPreferences}
          setCustomPreferences={setCustomPreferences}
          onSubmit={handleSearch}
          locationsList={locationsList}
          cuisinesList={cuisinesList}
          loading={loading}
        />

        <RecommendationsList
          recommendations={recommendations}
          warnings={warnings}
          loading={loading}
          loaderMessage={loaderMessage}
          hasSearched={hasSearched}
          error={error}
          onRetry={handleRetry}
        />
      </main>
    </div>
  );
}
