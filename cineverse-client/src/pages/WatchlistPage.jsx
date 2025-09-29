import React, { useEffect, useMemo, useState } from 'react';
import { useUserStore } from '../store/useUserStore';
import { getMovieDetails } from '../api/movieApi';
import MovieCard from '../components/MovieCard';

export default function WatchlistPage() {
  const { watchlistIds, favoriteIds, fetchUserLists } = useUserStore();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const ids = useMemo(() => Array.from(watchlistIds), [watchlistIds]);

  useEffect(() => {
    fetchUserLists();
  }, [fetchUserLists]);

  useEffect(() => {
    let isCancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(ids.map(id => getMovieDetails(id).then(r => r.data)));
        if (!isCancelled) setMovies(results);
      } catch (e) {
        if (!isCancelled) setMovies([]);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };
    if (ids.length > 0) {
      load();
    } else {
      setMovies([]);
      setLoading(false);
    }
    return () => { isCancelled = true; };
  }, [ids]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">İzleme Listem</h1>
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-800 rounded-lg h-96" />
          ))}
        </div>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} isFavorite={favoriteIds.has(movie.id)} isInWatchlist={true} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">Henüz izleme listenizde film yok.</div>
      )}
    </div>
  );
}