import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';
import { searchMovies } from '../api/movieApi';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('searchHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const debouncedQuery = useDebounce(query, 500);
  
  // Search when debouncedQuery changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      setIsSearching(true);
      searchMovies(debouncedQuery)
        .then(res => {
          setResults(res.data.results.slice(0, 5));
        })
        .catch(err => console.error(err))
        .finally(() => setIsSearching(false));
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  // Save history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(history.slice(0, 5)));
  }, [history]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Add to history
    setHistory(prev => [
      query, 
      ...prev.filter(item => item !== query)
    ].slice(0, 5));
    
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Film ara..."
          className="w-full px-4 py-2 pl-10 pr-10 bg-gray-800 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </span>
        {isSearching && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className="w-5 h-5 text-gray-400 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
        )}
      </form>

      {/* Dropdown results */}
      {(results.length > 0 || history.length > 0) && query && (
        <div className="absolute z-10 w-full mt-2 bg-gray-800 rounded-md shadow-lg overflow-hidden">
          {results.length > 0 ? (
            <ul>
              {results.map(movie => (
                <li key={movie.id} className="border-b border-gray-700 last:border-0">
                  <button 
                    onClick={() => {
                      navigate(`/movie/${movie.id}`);
                      setQuery('');
                      setResults([]);
                    }}
                    className="flex items-center p-3 hover:bg-gray-700 w-full text-left"
                  >
                    {movie.poster_path ? (
                      <img 
                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} 
                        alt={movie.title}
                        className="w-10 h-14 object-cover rounded-sm mr-3"
                      />
                    ) : (
                      <div className="w-10 h-14 bg-gray-600 rounded-sm mr-3 flex items-center justify-center text-gray-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-white">{movie.title}</div>
                      <div className="text-xs text-gray-400">
                        {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Tarih yok'}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            history.length > 0 && (
              <ul>
                <li className="px-3 py-2 text-xs text-gray-400">Önceki aramalar</li>
                {history.map((item, index) => (
                  <li key={index} className="border-b border-gray-700 last:border-0">
                    <button
                      onClick={() => {
                        setQuery(item);
                        inputRef.current.focus();
                      }}
                      className="flex items-center p-3 hover:bg-gray-700 w-full text-left"
                    >
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      )}
    </div>
  );
}