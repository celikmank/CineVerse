import React, { useState, useEffect } from 'react';
import { searchMovies } from '../api/movieApi';

export default function SmartSearch() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);

  const handleSearch = async (searchTerm) => {
    if (searchTerm.length < 2) return;
    
    try {
      const results = await searchMovies(searchTerm);
      setSuggestions(results.data.results.slice(0, 5));
    } catch (error) {
      console.error('Arama hatası:', error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => handleSearch(query), 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="🎬 Film, aktör, yönetmen ara..."
        className="w-full px-6 py-3 pl-12 rounded-xl bg-dark-200/80 backdrop-blur-sm border border-dark-300 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent"
      />

      {/* Search Suggestions */}
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-dark-200 rounded-lg shadow-lg border border-dark-300 z-50">
          {suggestions.map(movie => (
            <div key={movie.id} className="p-3 hover:bg-dark-300 cursor-pointer border-b border-dark-400 last:border-b-0">
              <div className="flex items-center space-x-3">
                <img 
                  src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                  alt={movie.title}
                  className="w-10 h-14 object-cover rounded"
                />
                <div>
                  <div className="text-white font-medium">{movie.title}</div>
                  <div className="text-gray-400 text-sm">
                    {movie.release_date?.substring(0, 4)} • ⭐ {movie.vote_average?.toFixed(1)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}