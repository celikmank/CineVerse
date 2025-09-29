import React, { useEffect, useState } from "react";
import { getPopularMovies, searchMovies, getTopRatedMovies, getUpcomingMovies, getNowPlayingMovies } from "../api/movieApi";
import MovieCard from "../components/MovieCard";
import { useUserStore } from "../store/useUserStore";

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('popular');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = React.useRef(null);
  
  const { favoriteIds, watchlistIds, fetchUserLists, toggleWatchlist } = useUserStore();

  // İlk yükleme
  useEffect(() => {
    fetchUserLists();
    loadMovies('popular', 1, true);
  }, [fetchUserLists]);

  // Tab değişimi
  useEffect(() => {
    if (query) return;
    loadMovies(activeTab, 1, true);
  }, [activeTab]);

  // Arama
  useEffect(() => {
    const handler = setTimeout(() => {
      if (query) {
        searchMovies(query, 1).then(res => {
          setMovies(res.data.results || []);
          setPage(1);
          setHasMore((res.data.page || 1) < (res.data.total_pages || 1));
        });
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  // Infinite scroll
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isLoading && !isLoadingMore) {
        loadMovies(query ? 'search' : activeTab, page + 1, false);
      }
    }, { rootMargin: '200px' });
    
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading, isLoadingMore, page, activeTab, query]);

  const loadMovies = async (type, pageNum, reset = false) => {
    if (reset) {
      setIsLoading(true);
      setPage(pageNum);
    } else {
      setIsLoadingMore(true);
    }

    try {
      let res;
      if (type === 'search') {
        res = await searchMovies(query, pageNum);
      } else if (type === 'popular') {
        res = await getPopularMovies(pageNum);
      } else if (type === 'top_rated') {
        res = await getTopRatedMovies(pageNum);
      } else if (type === 'upcoming') {
        res = await getUpcomingMovies(pageNum);
      } else if (type === 'now_playing') {
        res = await getNowPlayingMovies(pageNum);
      }

      const newMovies = res?.data?.results || [];
      
      if (reset) {
        setMovies(newMovies);
      } else {
        setMovies(prev => [...prev, ...newMovies]);
        setPage(pageNum);
      }
      
      setHasMore((res?.data?.page || pageNum) < (res?.data?.total_pages || pageNum));
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Hero movie
  const heroMovie = movies[0];

  return (
    <div className="min-h-screen bg-dark-100">
      {/* Netflix Hero Section */}
      {heroMovie && !query && (
        <div className="relative h-screen w-full mb-16">
          {/* Background */}
          <div className="absolute inset-0">
            <img
              src={heroMovie.backdrop_path 
                ? `https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}` 
                : `https://image.tmdb.org/t/p/w1280${heroMovie.poster_path}`
              }
              alt={heroMovie.title}
              className="w-full h-full object-cover"
            />
            {/* Gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-100 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                {heroMovie.title}
              </h1>
              
              <p className="text-xl text-gray-200 mb-8 line-clamp-3 leading-relaxed">
                {heroMovie.overview}
              </p>
              
              <div className="flex items-center space-x-4 mb-8">
                <div className="flex items-center space-x-2">
                  <span className="text-accent-400">⭐</span>
                  <span className="text-white font-semibold text-lg">{heroMovie.vote_average?.toFixed(1)}</span>
                </div>
                
                {heroMovie.release_date && (
                  <span className="text-gray-300 text-lg">
                    {new Date(heroMovie.release_date).getFullYear()}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                <button className="bg-white text-black font-bold py-4 px-8 rounded-lg hover:bg-gray-200 transition-all duration-300 flex items-center space-x-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <span>Oynat</span>
                </button>
                
                <button 
                  onClick={() => toggleWatchlist(heroMovie.id)}
                  className="bg-gray-600/80 backdrop-blur-sm text-white font-bold py-4 px-8 rounded-lg hover:bg-gray-600 transition-all duration-300 flex items-center space-x-3"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span>Listem</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 pb-16">
        {/* Tabs and Search */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            {/* Category Tabs */}
            <div className="flex items-center space-x-6">
              {[
                { key: 'popular', label: 'Popüler', icon: '🔥' },
                { key: 'top_rated', label: 'En İyi', icon: '⭐' },
                { key: 'upcoming', label: 'Yakında', icon: '📅' },
                { key: 'now_playing', label: 'Vizyonda', icon: '🎭' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === tab.key
                      ? 'bg-brand-600 text-white shadow-netflix scale-105'
                      : 'text-gray-400 hover:text-white hover:bg-dark-200'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Film ara..."
                className="w-80 px-6 py-3 pl-12 rounded-xl bg-dark-200/50 backdrop-blur-sm border border-dark-300 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all duration-300"
              />
              <svg className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Movies Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-6">
            {Array.from({ length: 21 }).map((_, i) => (
              <div key={i} className="aspect-[16/9] bg-dark-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-6">
              {(query ? movies : movies.slice(1)).map(movie => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  isFavorite={favoriteIds.has(movie.id)} 
                  isInWatchlist={watchlistIds.has(movie.id)} 
                />
              ))}
            </div>

            <div ref={sentinelRef} className="h-20" />
            
            {isLoadingMore && (
              <div className="mt-12 text-center">
                <div className="inline-flex items-center px-8 py-4 bg-dark-200/50 backdrop-blur-sm rounded-xl">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-600 mr-4"></div>
                  <span className="text-gray-300 font-medium">Daha fazla yükleniyor...</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}